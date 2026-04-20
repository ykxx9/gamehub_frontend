const BASE_URL = "http://127.0.0.1:6090";

let allGames = [];

function viewGame(id) {
    const game = allGames.find(g => g.id === id);

    const detail = document.getElementById("game-detail");
    const list = document.getElementById("game-list");

    list.style.display = "none";
    detail.style.display = "block";

    detail.innerHTML = `
        <h2>${game.title}</h2>
        <p><strong>Genre:</strong> ${game.genre}</p>
        <p>${game.description}</p>
        <p><strong>Rating:</strong> ${game.rating}</p>
        <a href="${game.game_url}" target="_blank">Play / Download</a>
        <br><br>
        <button onclick="goBack()">Back</button>
    `;
}

function goBack() {
    document.getElementById("game-detail").style.display = "none";
    document.getElementById("game-list").style.display = "flex";
}

// ---------------- AUTH ----------------

function register() {
    fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: "test2",
            password: "1234"
        })
    })
    .then(res => res.json())
    .then(data => console.log("REGISTER:", data))
    .catch(err => console.error(err));
}

function login() {
    fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: "test2",
            password: "1234"
        })
    })
    .then(res => res.json())
    .then(data => console.log("LOGIN:", data))
    .catch(err => console.error(err));
}

// ---------------- GAME CRUD ----------------

function addGame() {
    fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title: "Sample Game",
            description: "Test game",
            genre: "action",
            rating: "4.9",
            game_url: "https://example.com"
        })
    })
    .then(res => res.json())
    .then(data => console.log("ADD:", data))
    .catch(err => console.error(err));
}

function getGames() {
    fetch("http://127.0.0.1:6090/games")
    .then(res => res.json())
    .then(data => {
        allGames = data;

        const container = document.getElementById("game-list");
        container.innerHTML = "";

        data.forEach(game => {
            const card = createGameCard(game);
            container.appendChild(card);
        });
    });
}

function updateGame() {
    fetch(`${BASE_URL}/games/1`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title: "Updated Game",
            description: "Updated description",
            genre: "action",
            rating: "4.9",
            game_url: "https://updated.com"
        })
    })
    .then(res => res.json())
    .then(data => console.log("UPDATE:", data))
    .catch(err => console.error(err));
}

function deleteGame() {
    fetch(`${BASE_URL}/games/1`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => console.log("DELETE:", data))
    .catch(err => console.error(err));
}


function createGameCard(game) {
    const card = document.createElement("div");

    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px";
    card.style.width = "250px";

    card.innerHTML = `
        <h3>${game.title}</h3>
        <p><strong>Genre:</strong> ${game.genre}</p>
        <p>${game.description || ""}</p>
        <p><strong>Rating:</strong> ${game.rating || "N/A"}</p>
        <button onclick="viewGame(${game.id})">View</button>
    `;

    return card;
}