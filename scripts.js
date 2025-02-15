document.addEventListener('DOMContentLoaded', () => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    let sequence = [];
    let playerSequence = [];
    let round = 0;
    let playerName = '';

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const playerNameInput = document.getElementById('UserplayerName');
    const highScoresList = document.getElementById('highScoresList');
    const gameDiv = document.getElementById('game');
    const menuDiv = document.getElementById('menu');
    const scoreDiv = document.getElementById('score');

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);

    function startGame() {
        console.log("hola")
        playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }
        menuDiv.style.display = 'none';
        gameDiv.style.display = 'block';
        resetGame();
        nextRound();
    }

    function resetGame() {
        sequence = [];
        playerSequence = [];
        round = 0;
        updateScore();
        loadHighScores();
    }

    function nextRound() {
        round++;
        playerSequence = [];
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        playSequence();
    }

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            activateButton(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function activateButton(color) {
        const button = document.querySelector(`.${color}`);
        button.classList.add('active');
        playSound(color);
        setTimeout(() => {
            button.classList.remove('active');
        }, 500);
    }

    function playSound(color) {
        const audio = new Audio(`sounds/${color}.mp3`);
        audio.play();
    }

    function handleButtonClick(color) {
        playerSequence.push(color);
        activateButton(color);
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            gameOver();
            return;
        }
        if (playerSequence.length === sequence.length) {
            updateScore();
            setTimeout(nextRound, 1000);
        }
    }

    function gameOver() {
        alert(`Juego Terminado! Tu puntaje fue: ${round - 1}`);
        saveHighScore(playerName, round - 1);
        resetGame();
        menuDiv.style.display = 'block';
        gameDiv.style.display = 'none';
    }

    function updateScore() {
        scoreDiv.textContent = `Puntaje: ${round}`;
    }

    function saveHighScore(name, score) {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ name, score });
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        loadHighScores();
    }

    function loadHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScoresList.innerHTML = highScores.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
    }

    colors.forEach(color => {
        document.querySelector(`.${color}`).addEventListener('click', () => handleButtonClick(color));
    });

    loadHighScores();
});