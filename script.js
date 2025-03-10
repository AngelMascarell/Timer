let players = [];
let currentPlayer = 0;
let interval;
let isPaused = false;
let isGameStarted = false;
let gameOverSound = new Audio('/music/andy.mp3');


function startGame() {
    const playerCount = parseInt(document.getElementById("players").value);
    const timersDiv = document.getElementById("timers");
    timersDiv.innerHTML = "";

    const timeInput = parseInt(document.getElementById("time-input").value);

    if (!isGameStarted) {
        isGameStarted = true;
    }

    players = Array.from({ length: playerCount }, () => timeInput);
    currentPlayer = 0;
    isPaused = false;
    document.getElementById("pause-btn").textContent = "Pausar";

    players.forEach((_, index) => {
        let div = document.createElement("div");
        div.classList.add("timer");
        div.id = `player-${index}`;
        div.innerHTML = `
            <p>Jugador ${index + 1}</p>
            <p id="time-${index}">${formatTime(timeInput)}</p>
            <button onclick="changeTurn(${index})">Cambiar Turno</button>
        `;
        timersDiv.appendChild(div);
    });

    highlightActivePlayer();
    startTimer();

    timersDiv.scrollIntoView({ behavior: 'smooth' });
}

function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused && players[currentPlayer] > 0) {
            players[currentPlayer]--;
            updateTimers();
        } else if (players[currentPlayer] === 0) {
            clearInterval(interval);
            gameOverSound.play();
            alert(`¡Jugador ${currentPlayer + 1} ha perdido por tiempo!`);
        }
    }, 1000);
}

function updateTimers() {
    players.forEach((time, index) => {
        document.getElementById(`time-${index}`).textContent = formatTime(time);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    isGameStarted = false;
    const timersDiv = document.getElementById("timers");
    timersDiv.innerHTML = "";
    document.getElementById("pause-btn").textContent = "Pausar";
}

function highlightActivePlayer() {
    document.querySelectorAll(".timer").forEach((el, index) => {
        el.classList.toggle("active", index === currentPlayer);
    });
}