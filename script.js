let players = [];
let currentPlayer = 0;
let interval;
let isPaused = false;

function startGame() {
    const playerCount = parseInt(document.getElementById("players").value);
    const timersDiv = document.getElementById("timers");
    timersDiv.innerHTML = "";

    players = Array.from({ length: playerCount }, () => 300);
    currentPlayer = 0;
    isPaused = false;
    document.getElementById("pause-btn").textContent = "Pausar";

    players.forEach((_, index) => {
        let div = document.createElement("div");
        div.classList.add("timer");
        div.id = `player-${index}`;
        div.innerHTML = `
            <p>Jugador ${index + 1}</p>
            <p id="time-${index}">5:00</p>
            <button onclick="changeTurn(${index})">Cambiar Turno</button>
        `;
        timersDiv.appendChild(div);
    });

    highlightActivePlayer();
    startTimer();
}

function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused && players[currentPlayer] > 0) {
            players[currentPlayer]--;
            updateTimers();
        } else if (players[currentPlayer] === 0) {
            clearInterval(interval);
            alert(`¡Jugador ${currentPlayer + 1} ha perdido por tiempo!`);
        }
    }, 1000);
}

function updateTimers() {
    players.forEach((time, index) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById(`time-${index}`).textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    });
}

function changeTurn(playerIndex) {
    if (playerIndex !== currentPlayer || isPaused) return;

    currentPlayer = (currentPlayer + 1) % players.length;
    highlightActivePlayer();
}

function pauseGame() {
    isPaused = !isPaused;
    document.getElementById("pause-btn").textContent = isPaused ? "Reanudar" : "Pausar";
    if (!isPaused) startTimer();
}

function resetGame() {
    clearInterval(interval);
    startGame();
}

function highlightActivePlayer() {
    document.querySelectorAll(".timer").forEach((el, index) => {
        el.classList.toggle("active", index === currentPlayer);
    });
}
