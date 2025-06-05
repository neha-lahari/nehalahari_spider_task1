let player1 = "Red"
let player2 = "Blue"
let currentplayer = 1;
let timer = null;
let timerSeconds = 20;
let timeLeft = timerSeconds;
//taking names and starting the game
document.getElementById("game-start").addEventListener("click", () => {
    const name1 = document.getElementById("player1-name").value.trim();
    const name2 = document.getElementById("player2-name").value.trim();
    if (name1) {
        player1 = name1;
    }
    if (name2) {
        player2 = name2;
    }
    document.getElementById("names").style.display = "none";
    document.getElementById("container").style.display = "block";
    updateturnDisplay();
    createGrid();
    instruction(`Player ${blockingPlayer === 1 ? player1 : player2} block a column!!`);

});
//to update turn display
function updateturnDisplay() {
    const display = document.getElementById("turn-display");
    const color = currentplayer === 1 ? '#985E6D' : '#547792';
    const circle = `<span class="turn-circle" style="background-color:${color};"></span>`;
    const name = currentplayer === 1 ? player1 : player2;
    display.innerHTML = `${circle} Turn:${name} <span id="player-timer"></span>`;
    updateTimerDisplay();
    startPlayerTimer();
}
//theme switch
const themeSwitch = document.getElementById("theme-toggle");
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
});
//updates the timer
function updateTimerDisplay() {
    document.getElementById("player-timer").textContent = ` | Time left: ${timeLeft}s`;
}//timer for players
function startPlayerTimer() {
    if (timer) clearInterval(timer);

    timeLeft = timerSeconds;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Opponent wins
            const winner = currentplayer === 1 ? player2 : player1;
            gameOver = true;
            gameOverpopup(winner + " (Time Out)");
        }
    }, 1000);
}
const rows = 6;
const cols = 7;
let phase = "block";
let blockingPlayer = 2;
let placingPlayer = 1;
let blockedColumn = -1;
//creates the grid(6x7) and handles clicks
function createGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => {
                if (gameOver) return;
                const col = parseInt(cell.dataset.col);

                if (phase !== "place") return;
                if (col === blockedColumn) return;
                saveHistory();
                playSound('audio-place');

                for (let i = rows - 1; i >= 0; i--) {
                    const target = document.querySelector(`.cell[data-row='${i}'][data-col='${col}']`);
                    if (!target.classList.contains("red") && !target.classList.contains("blue") && !target.classList.contains("blocked")) {
                        target.classList.add(currentplayer === 1 ? "red" : "blue");
                        gameBoard[i][col] = currentplayer === 1 ? "red" : "blue";
                        winCondition();
                        blockedColumn = -1;

                        clearBlockedcols();
                        [blockingPlayer, placingPlayer] = [placingPlayer, blockingPlayer];
                        currentplayer = blockingPlayer;
                        phase = "block";
                        instruction(`Player ${currentplayer === 1 ? player1 : player2} block a column!`);
                        updateturnDisplay();
                        break;
                    }
                }
            });
            grid.appendChild(cell);
        }
    }
}
//gameboard as a 2d array
let gameBoard = [];
for (let i = 0; i < rows; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < cols; j++) {
        gameBoard[i][j] = null;

    }
}//added event listners to all column block buttons
const blockedbtns = document.querySelectorAll(".block-btn");
for (let i = 0; i < blockedbtns.length; i++) {
    blockedbtns[i].addEventListener("click", () => {
        if (phase !== "block") return;
        saveHistory();
        playSound('audio-block');
        //this is for checking atleast 1 column is there to place the disc
        let remainingcol = false;
        for (let c = 0; c < cols; c++) {
            if (c === i) continue;

            for (let r = 0; r < rows; r++) {
                if (gameBoard[r][c] === null) {
                    remainingcol = true;
                    break;
                }
            }

            if (remainingcol) break;
        }

        if (!remainingcol) {
            alert(`Cannot block column ${i + 1} !!as no other columns are available for disc placement.`);
            return;
        }
        blockedColumn = i;
        markBlockedcols(blockedColumn);

        instruction(`Column ${i + 1} blocked!! Player ${placingPlayer === 1 ? player1 : player2}, place your disc.`);
        currentplayer = placingPlayer;
        phase = "place";
        updateturnDisplay();
    })
}
//instructions to players
const msg = document.getElementById("message");
function instruction(text) {
    msg.textContent = text;

}
// marks all cells in a column as blocked visually(red color)
function markBlockedcols(col) {
    clearBlockedcols();
    const cells = document.querySelectorAll(`.cell[data-col='${col}']`);
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.add("blocked");

    }
}//removes that blocked class
function clearBlockedcols() {
    const blockedCells = document.querySelectorAll(".blocked");
    for (let i = 0; i < blockedCells.length; i++) {
        blockedCells[i].classList.remove("blocked");

    }
}
//win conditions
let gameOver = false;
function winCondition() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (j <= cols - 4) {
                if (gameBoard[i][j] === "red" && gameBoard[i][j + 1] === "red" && gameBoard[i][j + 2] === "red" && gameBoard[i][j + 3] === "red") {
                    gameOverpopup(player1);
                    gameOver = true;
                    return;

                }
                if (gameBoard[i][j] === "blue" && gameBoard[i][j + 1] === "blue" && gameBoard[i][j + 2] === "blue" && gameBoard[i][j + 3] === "blue") {
                    gameOverpopup(player2);
                    gameOver = true;
                    return;

                }
            }
            if (i <= rows - 4) {
                if (gameBoard[i][j] === "red" && gameBoard[i + 1][j] === "red" && gameBoard[i + 2][j] === "red" && gameBoard[i + 3][j] === "red") {
                    gameOverpopup(player1);
                    gameOver = true;
                    return;

                }
                if (gameBoard[i][j] === "blue" && gameBoard[i + 1][j] === "blue" && gameBoard[i + 2][j] === "blue" && gameBoard[i + 3][j] === "blue") {
                    gameOverpopup(player2);
                    gameOver = true;

                    return;
                }
            }
            if (i <= rows - 4 && j <= cols - 4) {
                if (gameBoard[i][j] === "red" && gameBoard[i + 1][j + 1] === "red" && gameBoard[i + 2][j + 2] === "red" && gameBoard[i + 3][j + 3] === "red") {
                    gameOverpopup(player1);
                    gameOver = true;
                    return;
                }
                if (gameBoard[i][j] === "blue" && gameBoard[i + 1][j + 1] === "blue" && gameBoard[i + 2][j + 2] === "blue" && gameBoard[i + 3][j + 3] === "blue") {
                    gameOverpopup(player2);
                    gameOver = true;
                    return;
                }
            }
            if (i <= rows - 4 && j >= 3) {
                if (gameBoard[i][j] === "red" && gameBoard[i + 1][j - 1] === "red" && gameBoard[i + 2][j - 2] === "red" && gameBoard[i + 3][j - 3] === "red") {
                    gameOverpopup(player1);
                    gameOver = true;
                    return;

                }
                if (gameBoard[i][j] === "blue" && gameBoard[i + 1][j - 1] === "blue" && gameBoard[i + 2][j - 2] === "blue" && gameBoard[i + 3][j - 3] === "blue") {
                    gameOverpopup(player2);
                    gameOver = true;
                    return;

                }
            }
        }
    }//draw conditions
    let isDraw = true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameBoard[r][c] === null) {
                isDraw = false;
                break;
            }
        }
        if (!isDraw) break;
    }

    if (isDraw) {
        drawPopup();
        gameOver = true;
    }
}
//shows the game over popup for a win, updates leaderboard and plays win sound
function gameOverpopup(winner) {
    playSound('audio-win');
    if (timer) clearInterval(timer);
    const popup = document.getElementById("leaderboard-popup");
    popup.style.display = "block";
    document.body.style.overflow = 'hidden';
    document.getElementById("game-result").textContent = `${winner} wins!`;

    let winnerName = winner.replace(" (Time Out)", "");
    let score = 2;
    saveScore(winnerName, score);
    showLeaderboard();
}
function drawPopup() {
    playSound('audio-draw');
    if (timer) clearInterval(timer);
    const popup = document.getElementById("leaderboard-popup");
    popup.style.display = "block";
    document.body.style.overflow = 'hidden';
    document.getElementById("game-result").textContent = `It's a draw!`;
    saveScore(player1, 1);
    saveScore(player2, 1);
    showLeaderboard();
}//to restart game
function restartGame() {
    if (timer) clearInterval(timer);
    gameOver = false;
    phase = "block";
    blockingPlayer = 2;
    placingPlayer = 1;
    blockedColumn = -1;
    currentplayer = blockingPlayer;
    gameBoard = [];

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < cols; j++) {
            gameBoard[i][j] = null;
        }
    }
    createGrid();

    document.getElementById("leaderboard-popup").style.display = "none";
    document.body.style.overflow = '';
    document.getElementById("container").style.display = "block";

    instruction(`Player ${blockingPlayer === 1 ? player1 : player2} block a column!!`);
    currentplayer = blockingPlayer;
    updateturnDisplay();
    clearBlockedcols();
    history = [];
}
// Sound toggle
let soundEnabled = true;
document.getElementById('sound-toggle').addEventListener('change', function () {
    soundEnabled = this.checked;
});//Plays a sound if sound is enabled.
function playSound(id) {
    if (soundEnabled) {
        const audio = document.getElementById(id);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
}
//saving history for undo functionality
let history = [];
function saveHistory() {
    let boardCopy = [];

    for (let i = 0; i < gameBoard.length; i++) {
        boardCopy.push([...gameBoard[i]]); // copy each row
    }
    history.push({
        board: boardCopy,
        currentplayer: currentplayer,
        phase: phase,
        blockedColumn: blockedColumn,
        gameOver: gameOver
    });
}
// Restores the previous game state from the history
function undoMove() {
    if (history.length === 0) return;

    let lastState = history.pop();
    gameBoard = [];

    for (let i = 0; i < lastState.board.length; i++) {
        gameBoard.push([...lastState.board[i]]);
    }

    currentplayer = lastState.currentplayer;
    phase = lastState.phase;
    blockedColumn = lastState.blockedColumn;
    gameOver = lastState.gameOver;

    updateBoard();
    updateturnDisplay();

    // to show blocked column again if needed
    clearBlockedcols();
    if (blockedColumn !== -1) {
        markBlockedcols(blockedColumn);
    }
}
// Connect the undo button
document.getElementById('undo-btn').addEventListener('click', undoMove);
//updates the board
function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
            if (!cell) continue;
            cell.classList.remove('red', 'blue');
            if (gameBoard[r][c] === 'red') cell.classList.add('red');
            if (gameBoard[r][c] === 'blue') cell.classList.add('blue');
        }
    }
}//saves score for leaderboard
function saveScore(name, score) {
    let scores = localStorage.getItem("leaderboard")
    if (scores) {
        scores = JSON.parse(scores)
    } else {
        scores = [];
    }
    scores.push({ name: name, score: score });
    scores.sort((a, b) => {
        b.score - a.score
    });
    scores = scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));

}//to display leaderboard
function showLeaderboard() {
    let scores = localStorage.getItem("leaderboard");

    if (scores) {
        scores = JSON.parse(scores);
    } else {
        scores = [];
    }
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    for (let i = 0; i < scores.length; i++) {
        const item = document.createElement("li");
        item.textContent = (i + 1) + ". " + scores[i].name + " - " + scores[i].score + " points";
        list.appendChild(item);
    }
    document.getElementById("leaderboard").style.display = "block";
}
