const board = document.getElementById("board");
const winnerMessage = document.getElementById("winnerMessage");
let gameBoard = Array(9).fill("");
let currentPlayer = "X";
let mode = document.getElementById("mode").value;

function createBoard() {
    board.innerHTML = "";
    winnerMessage.textContent = "";  
    winnerMessage.classList.remove("show-winner");  
    gameBoard.forEach((cell, index) => {
        let cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        if (cell) cellDiv.dataset.player = cell; // Assign player color
        cellDiv.addEventListener("click", handleClick);
        board.appendChild(cellDiv);
    });
}

function handleClick(event) {
    let index = event.target.dataset.index;
    if (gameBoard[index] !== "" || checkWinner()) return;
    gameBoard[index] = currentPlayer;
    createBoard();
    if (checkWinner()) return;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (mode === "ai" && currentPlayer === "O") setTimeout(aiMove, 500);
}

function aiMove() {
    let bestMove = minimax(gameBoard, "O").index;
    if (bestMove !== undefined) {
        gameBoard[bestMove] = "O";
        createBoard();
        if (checkWinner()) return;
        currentPlayer = "X";
    }
}

function minimax(board, player) {
    let emptyCells = board.map((cell, idx) => cell === "" ? idx : null).filter(idx => idx !== null);
    let winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] === board[b] && board[a] !== "" && board[c] === "") return { index: c };
        if (board[a] === board[c] && board[a] !== "" && board[b] === "") return { index: b };
        if (board[b] === board[c] && board[b] !== "" && board[a] === "") return { index: a };
    }
    
    if (emptyCells.length === 0) return { score: 0 };
    return { index: emptyCells[Math.floor(Math.random() * emptyCells.length)] };
}

function checkWinner() {
    let winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            winnerMessage.textContent = `${gameBoard[a]} Wins! 🎉`;
            winnerMessage.classList.add("show-winner");
            return true;
        }
    }
    if (!gameBoard.includes("")) {
        winnerMessage.textContent = "It's a Draw! 🤝";
        winnerMessage.classList.add("show-winner");
        return true;
    }
    return false;
}

function restartGame() {
    gameBoard = Array(9).fill("");
    currentPlayer = "X";
    mode = document.getElementById("mode").value;
    createBoard();
}

createBoard();
