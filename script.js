var base_url = "http://127.0.0.1:6090";
var all_games = [];

function getgames() {
    var grid = document.getElementById("game-grid");
    if (!grid) return;
    grid.innerHTML = "<p>Loading...</p>";
    
    fetch(base_url + "/games")
        .then(function(res) { return res.json(); })
        .then(function(json) {
            if (json.success && json.data.length > 0) {
                all_games = json.data;
                showgames(all_games);
            } else {
                grid.innerHTML = "<p>No game found</p>";
            }
        })
        .catch(function() {
            alert("something went wrong");
        });
}

function showgames(games) {
    var grid = document.getElementById("game-grid");
    grid.innerHTML = "";
    if (games.length === 0) {
        grid.innerHTML = "<p>No game found</p>";
        return;
    }
    for (var i = 0; i < games.length; i++) {
        var g = games[i];
        var card = document.createElement("div");
        card.className = "game-card";
        
        var img = g.game_url;
        if (img === "placeholder") {
            img = "https://via.placeholder.com/300x160/a855f7/ffffff?text=Vyntrix";
        }
        
        card.innerHTML = 
            '<img src="' + img + '">' +
            '<div class="card-body">' +
                '<h3>' + g.title + '</h3>' +
                '<p>' + g.genre + '</p>' +
                '<span>⭐ ' + g.rating + '</span>' +
            '</div>';
        grid.appendChild(card);
    }
}

function searchgames() {
    var q = document.getElementById("search-input").value.toLowerCase();
    var filtered = [];
    for (var i = 0; i < all_games.length; i++) {
        var g = all_games[i];
        if (g.title.toLowerCase().indexOf(q) === 0) {
            filtered.push(g);
        }
    }
    showgames(filtered);
}

function filtergenre() {
    var genre = document.getElementById("genre-filter").value;
    var filtered = [];
    for (var i = 0; i < all_games.length; i++) {
        var g = all_games[i];
        if (genre === "all" || g.genre === genre) {
            filtered.push(g);
        }
    }
    showgames(filtered);
}

function getrandom() {
    var box = document.getElementById("random-box");
    if (!box) return;
    box.innerHTML = "<p>Loading...</p>";
    
    fetch(base_url + "/games/random")
        .then(function(res) { return res.json(); })
        .then(function(json) {
            if (json.success) {
                var g = json.data;
                var img = g.game_url;
                if (img === "placeholder") {
                    img = "https://via.placeholder.com/600x350/a855f7/ffffff?text=" + g.title;
                }
                box.innerHTML = 
                    '<img src="' + img + '">' +
                    '<h2>' + g.title + '</h2>' +
                    '<p><strong>' + g.genre + '</strong> • ⭐ ' + g.rating + '</p>' +
                    '<p>' + g.description + '</p>';
            }
        })
        .catch(function() {
            alert("something went wrong");
        });
}

function loginuser() {
    var u = document.getElementById("username").value;
    var p = document.getElementById("password").value;
    
    fetch(base_url + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p })
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
        if (json.success) {
            window.location.href = "home.html";
        } else {
            alert("Login failed");
        }
    })
    .catch(function() {
        alert("something went wrong");
    });
}

function registeruser() {
    var u = document.getElementById("username").value;
    var p = document.getElementById("password").value;
    
    fetch(base_url + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p })
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
        if (json.success) {
            alert("Registered successfully!");
            window.location.href = "login.html";
        } else {
            alert(json.error);
        }
    })
    .catch(function() {
        alert("something went wrong");
    });
}

function getprofilegames() {
    var list = document.getElementById("my-games-list");
    if (!list) return;
    list.innerHTML = "<p>Loading...</p>";
    
    fetch(base_url + "/games")
        .then(function(res) { return res.json(); })
        .then(function(json) {
            if (json.success && json.data.length > 0) {
                list.innerHTML = "";
                for (var i = 0; i < json.data.length; i++) {
                    var g = json.data[i];
                    var item = document.createElement("div");
                    item.className = "game-row";
                    item.innerHTML = 
                        '<div>' +
                            '<strong>' + g.title + '</strong><br>' +
                            '<span>' + g.genre + '</span>' +
                        '</div>' +
                        '<div>' +
                            '<button onclick="location.href=\'add.html?id=' + g.id + '\'">Update</button>' +
                            '<button onclick="deletegame(' + g.id + ')" class="btn-del">Delete</button>' +
                        '</div>';
                    list.appendChild(item);
                }
            } else {
                list.innerHTML = "<p>No game found</p>";
            }
        });
}

function checkedit() {
    var url_params = new URLSearchParams(window.location.search);
    var id = url_params.get("id");
    if (!id) return;
    
    document.getElementById("page-title").innerText = "Update Game";
    
    fetch(base_url + "/games/" + id)
        .then(function(res) { return res.json(); })
        .then(function(json) {
            if (json.success) {
                var g = json.data;
                document.getElementById("game-id").value = g.id;
                document.getElementById("title").value = g.title;
                document.getElementById("genre").value = g.genre;
                document.getElementById("desc").value = g.description;
                document.getElementById("rating").value = g.rating;
            }
        });
}

function submitgame() {
    var id = document.getElementById("game-id").value;
    var t = document.getElementById("title").value;
    var g = document.getElementById("genre").value;
    var d = document.getElementById("desc").value;
    var r = document.getElementById("rating").value;
    
    var method = id ? "PUT" : "POST";
    var url = id ? base_url + "/games/" + id : base_url + "/games";
    
    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: t,
            genre: g,
            description: d,
            rating: r,
            game_url: "placeholder",
            images: "placeholder"
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
        if (json.success) {
            window.location.href = "profile.html";
        } else {
            alert(json.error);
        }
    })
    .catch(function() {
        alert("something went wrong");
    });
}

function deletegame(id) {
    if (!confirm("Are you sure?")) return;
    fetch(base_url + "/games/" + id, { method: "DELETE" })
        .then(function() {
            getprofilegames();
        })
        .catch(function() {
            alert("something went wrong");
        });
}