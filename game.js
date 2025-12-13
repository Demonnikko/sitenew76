(function () {
  "use strict";

  function initGame() {
    const deck = document.getElementById("gameDeck");
    const msg = document.getElementById("gameMsg");
    if (!deck || !msg) return;

    deck.innerHTML = "";

    const lastPlayed = parseInt(localStorage.getItem("game_timestamp"), 10) || 0;
    if (Date.now() - lastPlayed < 24 * 60 * 60 * 1000) {
      deck.innerHTML = `<div style="padding:15px; border:1px solid #333; border-radius:10px;">
        <h3 style="font-family:var(--ff-head); color:#fff;">Попытка потрачена</h3>
        <p style="color:#777; margin-top:6px;">Возвращайтесь завтра 😉</p>
      </div>`;
      return;
    }

    const winIdx = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
      const isWin = (i === winIdx);
      const card = document.createElement("div");
      card.className = "card-play";
      card.innerHTML = `<div class="face back"></div><div class="face front" style="color:#000">${isWin ? "A♠" : "J♥"}</div>`;

      card.addEventListener("click", () => {
        document.querySelectorAll(".card-play").forEach(el => el.classList.add("flipped"));
        if (isWin) {
          msg.textContent = "ПОБЕДА! Скидка 20%";
          localStorage.setItem("game_win", "true");
        } else {
          msg.textContent = "Увы...";
          localStorage.setItem("game_win", "false");
        }
        localStorage.setItem("game_timestamp", String(Date.now()));
      });

      deck.appendChild(card);
    }
  }

  document.addEventListener("DOMContentLoaded", initGame);
})();