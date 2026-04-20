const BASE_URL = "http://127.0.0.1:6090";

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
    fetch(`${BASE_URL}/games`)
    .then(res => res.json())
    .then(data => {
        console.log("GAMES:", data);

        const container = document.getElementById("game-list");
        container.innerHTML = "";

        if (!Array.isArray(data)) {
            console.error("Expected array:", data);
            return;
        }

        data.forEach(game => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h3>${game.title}</h3>
                <p>${game.genre}</p>
                <p>${game.description || ""}</p>
                <hr>
            `;

            container.appendChild(div);
        });
    })
    .catch(err => console.error(err));
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