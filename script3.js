// Global Variables
let allGames = [];
let isLoggedIn = false;
let isLoginMode = true; // true = login, false = register

// -----------------------------------------
// 1. Fetch Games When Page Loads
// -----------------------------------------
window.onload = function() {
    getGames();
};

function getGames() {
    // Basic fetch request to your backend
    fetch('http://127.0.0.1:6090/games')
        .then(function(response) {
            return response.json(); // Convert response to JS object
        })
        .then(function(data) {
            allGames = data; // Save the games globally
            showGames(allGames); // Display them on the screen
        })
        .catch(function(error) {
            document.getElementById('gamesGrid').innerHTML = "Failed to load games. Check backend.";
        });
}

// -----------------------------------------
// 2. Show Games on the Screen
// -----------------------------------------
function showGames(gamesList) {
    let grid = document.getElementById('gamesGrid');
    grid.innerHTML = ""; // Clear existing games

    if (gamesList.length === 0) {
        grid.innerHTML = "No games found.";
        return;
    }

    // Loop through each game and build HTML
    for (let i = 0; i < gamesList.length; i++) {
        let game = gamesList[i];
        
        // Show edit/delete buttons ONLY if logged in
        let adminButtons = "";
        if (isLoggedIn === true) {
            adminButtons = `
                <i class="fas fa-edit" onclick="openEditModal(${game.id})" style="cursor: pointer; margin-right: 10px;"></i>
                <i class="fas fa-trash" onclick="deleteGame(${game.id})" style="cursor: pointer; color: red;"></i>
            `;
        }

        // Use a default image if game doesn't have one
        let image = game.gameCoverUrl;
        if (!image) {
            image = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800';
        }

        // Build the game card HTML
        let cardHtml = `
            <div class="game-card">
                <div class="game-cover" style="background-image: url('${image}')"></div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-genre">${game.genre || "Retro"}</div>
                    <p class="game-desc">${game.description}</p>
                    <div class="game-actions">
                        <a href="${game.game_url}" target="_blank" class="play-link">Play Now</a>
                        <div class="admin-actions">
                            ${adminButtons}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the card to the grid
        grid.innerHTML += cardHtml;
    }
}

// -----------------------------------------
// 3. Search Bar Logic
// -----------------------------------------
document.getElementById('searchInput').onkeyup = function(event) {
    let typedText = event.target.value.toLowerCase();
    let matchingGames = [];
    
    // Loop through all games to find matches
    for (let i = 0; i < allGames.length; i++) {
        let game = allGames[i];
        if (game.title.toLowerCase().includes(typedText)) {
            matchingGames.push(game);
        }
    }
    
    showGames(matchingGames); // Update screen with results
};

// -----------------------------------------
// 4. Play Random Game & Scrolling
// -----------------------------------------
function playRandomGame() {
    if (allGames.length === 0) {
        alert("No games available!");
        return;
    }
    
    // Pick a random number between 0 and total games
    let randomIndex = Math.floor(Math.random() * allGames.length);
    let randomGame = allGames[randomIndex];
    
    // Open the game link in a new tab
    window.open(randomGame.game_url, '_blank');
}

document.getElementById('randomGameHeroBtn').onclick = playRandomGame;
document.getElementById('randomGameNavBtn').onclick = playRandomGame;

document.getElementById('chooseGameBtn').onclick = function() {
    document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' });
};

// -----------------------------------------
// 5. Auth / Login / Register Flow
// -----------------------------------------

// Open / Close Login Modal
document.getElementById('authBtn').onclick = function() {
    document.getElementById('authModal').classList.add('show');
};
document.getElementById('closeAuth').onclick = function() {
    document.getElementById('authModal').classList.remove('show');
};

// Toggle between Login and Register modes
document.getElementById('authSwitchBtn').onclick = function(event) {
    event.preventDefault(); // Stop page from refreshing
    
    if (isLoginMode === true) {
        // Switch to Register Mode
        isLoginMode = false;
        document.getElementById('authTitle').innerText = "Register";
        document.getElementById('authSubmitBtn').innerText = "Sign Up";
        document.getElementById('authSwitchText').innerText = "Already have an account? ";
        document.getElementById('authSwitchBtn').innerText = "Login";
    } else {
        // Switch to Login Mode
        isLoginMode = true;
        document.getElementById('authTitle').innerText = "Sign In";
        document.getElementById('authSubmitBtn').innerText = "Login";
        document.getElementById('authSwitchText').innerText = "Don't have an account? ";
        document.getElementById('authSwitchBtn').innerText = "Register";
    }
};

// Submit Login or Register Form
document.getElementById('authForm').onsubmit = function(event) {
    event.preventDefault(); // Stop page reload
    
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;
    
    // Choose the right backend link based on mode
    let endpoint = isLoginMode ? '/login' : '/register';
    
    fetch('http://127.0.0.1:6090' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(function(response) {
        if (response.ok) {
            // Login Success!
            isLoggedIn = true;
            document.getElementById('authModal').classList.remove('show');
            document.getElementById('authBtn').classList.add('hidden'); // Hide login button
            document.getElementById('logoutBtn').classList.remove('hidden'); // Show logout
            document.getElementById('addGameNavBtn').classList.remove('hidden'); // Show add game
            showGames(allGames); // Refresh games to show edit/delete icons
        } else {
            alert("Authentication failed! Check your username/password.");
        }
    });
};

// Logout Button
document.getElementById('logoutBtn').onclick = function() {
    isLoggedIn = false;
    document.getElementById('authBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('addGameNavBtn').classList.add('hidden');
    showGames(allGames); // Refresh games to hide edit/delete icons
};

// -----------------------------------------
// 6. Add, Edit, and Delete Game Features
// -----------------------------------------

// Open Add Game Modal
document.getElementById('addGameNavBtn').onclick = function() {
    document.getElementById('gameForm').reset();
    document.getElementById('gameId').value = ""; // Empty ID means it's a new game
    document.getElementById('gameModalTitle').innerText = "Add New Game";
    document.getElementById('gameModal').classList.add('show');
};

// Close Game Modal
document.getElementById('closeGameModal').onclick = function() {
    document.getElementById('gameModal').classList.remove('show');
};

// Save a Game (Add or Update)
document.getElementById('gameForm').onsubmit = function(event) {
    event.preventDefault();
    
    let id = document.getElementById('gameId').value;
    
    // Gather all inputs from the form
    let gameData = {
        title: document.getElementById('gameTitle').value,
        description: document.getElementById('gameDescription').value,
        genre: document.getElementById('gameGenre').value,
        rating: document.getElementById('gameRating').value,
        game_url: document.getElementById('gameUrl').value,
        gameCoverUrl: document.getElementById('gameCoverUrl').value
    };
    
    // If ID exists, we are editing (PUT). If not, we are adding (POST)
    let methodType = id ? 'PUT' : 'POST';
    let targetUrl = id ? 'http://127.0.0.1:6090/games/' + id : 'http://127.0.0.1:6090/games';
    
    fetch(targetUrl, {
        method: methodType,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
    })
    .then(function(response) {
        if (response.ok) {
            document.getElementById('gameModal').classList.remove('show');
            getGames(); // Reload the games list to see the update
        } else {
            alert("Failed to save game.");
        }
    });
};

// Open Edit Modal (Called by the edit icon on the game card)
window.openEditModal = function(id) {
    // Find the right game in our array using a basic loop
    let gameToEdit = null;
    for (let i = 0; i < allGames.length; i++) {
        if (allGames[i].id === id) {
            gameToEdit = allGames[i];
            break;
        }
    }
    
    // Fill the form with the game's data
    if (gameToEdit) {
        document.getElementById('gameId').value = gameToEdit.id;
        document.getElementById('gameTitle').value = gameToEdit.title;
        document.getElementById('gameDescription').value = gameToEdit.description;
        document.getElementById('gameGenre').value = gameToEdit.genre || "";
        document.getElementById('gameRating').value = gameToEdit.rating || "";
        document.getElementById('gameUrl').value = gameToEdit.game_url;
        document.getElementById('gameCoverUrl').value = gameToEdit.gameCoverUrl || "";
        
        document.getElementById('gameModalTitle').innerText = "Edit Game";
        document.getElementById('gameModal').classList.add('show');
    }
};

// Delete a Game (Called by the trash icon on the game card)
window.deleteGame = function(id) {
    let confirmDelete = confirm("Are you sure you want to delete this game?");
    
    if (confirmDelete === true) {
        fetch('http://127.0.0.1:6090/games/' + id, {
            method: 'DELETE'
        })
        .then(function(response) {
            if (response.ok) {
                getGames(); // Reload the games list
            } else {
                alert("Failed to delete game.");
            }
        });
    }
};