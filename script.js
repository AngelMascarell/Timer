let players = [];
let currentPlayer = 0;
let interval;
let isPaused = false;
let isGameStarted = false;
let gameOverSound = new Audio('music/andy.mp3');
let isAlertActive = false;
let gameEnded = false;

document.getElementById('players').addEventListener('change', function () {
    const numPlayers = this.value;
    document.getElementById('timers').setAttribute('data-players', numPlayers);
});

function startGame() {
    const playerCount = parseInt(document.getElementById("players").value);
    const timersDiv = document.getElementById("timers");
    timersDiv.innerHTML = "";

    const timeInput = parseInt(document.getElementById("time-input").value);

    if (!isGameStarted) {
        isGameStarted = true;
    }

    players = Array.from({ length: playerCount }, () => ({ time: timeInput, active: true }));
    currentPlayer = 0;
    isPaused = false;
    document.getElementById("pause-btn").textContent = "Pausar";
    gameEnded = false;

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
    if (gameEnded) return;

    clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused && players[currentPlayer].time > 0) {
            players[currentPlayer].time--;
            updateTimers();
            checkForWinner();
        } else if (players[currentPlayer].time === 0 && players[currentPlayer].active) {
            handlePlayerLoss();
        }
    }, 1000);
}

function handlePlayerLoss() {
    isAlertActive = true;
    gameOverSound.play();

    players[currentPlayer].active = false;
    document.getElementById(`player-${currentPlayer}`).classList.add("eliminated");

    const activePlayers = players.filter(player => player.active);

    if (activePlayers.length === 1) {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        isAlertActive = false;
        clearInterval(interval);
        checkForWinner();
    } else {
        showLossAlert().then(() => {
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
            isAlertActive = false;

            moveToNextPlayer();
            highlightActivePlayer();
            startTimer();
        });
    }
}



function checkForWinner() {
    const activePlayers = players.filter(player => player.active);
    
    if (activePlayers.length === 1 && !gameEnded) {
        const winnerIndex = players.findIndex(player => player.active);
        gameEnded = true;
        clearInterval(interval);

        if (!gameOverSound.paused) {
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
        }
        gameOverSound.play();

        setTimeout(() => {
            showWinnerAlert(winnerIndex);
        }, 1000);
    }
}

function showWinnerAlert(winnerIndex) {
    return new Promise((resolve) => {
        gameOverSound.play();
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert");
        alertDiv.innerHTML = ` 
            <div class="alert-box">
                <p>¡Jugador ${winnerIndex + 1} es el ganador!</p>
                <button id="alert-accept-btn">Aceptar</button>
            </div>
        `;
        document.body.appendChild(alertDiv);

        document.getElementById("alert-accept-btn").addEventListener("click", () => {
            alertDiv.remove();
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
            resolve();
            resetGame();
        });
    });
}

function showLossAlert() {
    return new Promise((resolve) => {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert");
        alertDiv.innerHTML = ` 
            <div class="alert-box">
                <p>¡Jugador ${currentPlayer + 1} ha perdido por tiempo!</p>
                <button id="alert-accept-btn">Aceptar</button>
            </div>
        `;
        document.body.appendChild(alertDiv);

        document.getElementById("alert-accept-btn").addEventListener("click", () => {
            alertDiv.remove();
            resolve();
        });
    });
}

function moveToNextPlayer() {
    let originalPlayer = currentPlayer;
    do {
        currentPlayer = (currentPlayer + 1) % players.length;
    } while (!players[currentPlayer].active && currentPlayer !== originalPlayer);

    if (!players[currentPlayer].active) {
        clearInterval(interval);
        gameEnded = true;
    }
}

function updateTimers() {
    players.forEach((player, index) => {
        if (player.active) {
            document.getElementById(`time-${index}`).textContent = formatTime(player.time);
        }
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function changeTurn(playerIndex) {
    if (playerIndex !== currentPlayer || isPaused || gameEnded || !players[currentPlayer].active) return;

    moveToNextPlayer();
    highlightActivePlayer();
    startTimer();
}

function pauseGame() {
    isPaused = !isPaused;
    document.getElementById("pause-btn").textContent = isPaused ? "Reanudar" : "Pausar";
    if (!isPaused) startTimer();
}

function resetGame() {
    clearInterval(interval);
    isGameStarted = false;
    gameEnded = false;
    document.getElementById("timers").innerHTML = "";
    document.getElementById("pause-btn").textContent = "Pausar";
}

function highlightActivePlayer() {
    document.querySelectorAll(".timer").forEach((el, index) => {
        if (players[index].active) {
            el.classList.toggle("active", index === currentPlayer);
        } else {
            el.classList.add("eliminated");
        }
    });
}
