let players = [];
let currentPlayer = 0;
let interval;
let isPaused = false;
let isGameStarted = false;
let gameOverSound = new Audio('music/andy.mp3');
let isAlertActive = false;
let gameEnded = false;

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
        if (!isPaused && players[currentPlayer] > 0) {
            players[currentPlayer]--;
            updateTimers();
            checkForWinner();
        } else if (players[currentPlayer] === 0 && !isAlertActive) {
            isAlertActive = true;
            gameOverSound.play();
            showAlert().then(() => {
                gameOverSound.pause();
                gameOverSound.currentTime = 0;
                isAlertActive = false;
                changeTurn();
                startTimer();
            });
        }
    }, 1000);
}

function checkForWinner() {
    const playersWithTime = players.filter(playerTime => playerTime > 0);
    
    if (playersWithTime.length === 1 && !gameEnded) {
        const winnerIndex = players.indexOf(playersWithTime[0]);
        gameEnded = true;
        clearInterval(interval);
        
        if (!gameOverSound.paused) {
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
        }
        gameOverSound.play();

        setTimeout(() => {
            alert(`¡Jugador ${winnerIndex + 1} es el ganador!`);
            gameOverSound.pause();
            resetGame();
        }, 1000);
    }
}


function showAlert() {
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

        const acceptButton = document.getElementById("alert-accept-btn");
        acceptButton.addEventListener("click", () => {
            alertDiv.remove();
            resolve();
        });
    });
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
    if (playerIndex !== currentPlayer || isPaused || gameEnded) return;

    currentPlayer = (currentPlayer + 1) % players.length;
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
    const timersDiv = document.getElementById("timers");
    timersDiv.innerHTML = "";
    document.getElementById("pause-btn").textContent = "Pausar";
}

function highlightActivePlayer() {
    document.querySelectorAll(".timer").forEach((el, index) => {
        el.classList.toggle("active", index === currentPlayer);
    });
}
