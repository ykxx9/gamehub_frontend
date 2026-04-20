const container = document.getElementById("game-list");

games.forEach(game => {
  const card = document.createElement("div");

  card.innerHTML = `
    <h3>${game.title}</h3>
    <p>${game.genre}</p>
    <p>${game.price}</p>
    <p>${game.rating}</p>
    <button>View</button>
  `;

  container.appendChild(card);
});