// index.js
let board;
let currentPlayer;
let gameActive;
let gameMode;
let player1Score = 0;
let player2Score = 0;
let winningLine;

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const options = document.getElementById('options');
const gameBoard = document.getElementById('gameBoard');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');

function startGame(mode) {
    gameMode = mode;
    options.style.display = 'none';
    gameBoard.classList.add('visible');

    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x-class', 'o-class', 'winner');
    });

    displayMessage(`🎮 Player ${currentPlayer}'s turn`);

    if (winningLine) {
        winningLine.remove();
        winningLine = null;
    }

    if (gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer === 'X' ? 'x-class' : 'o-class');
        checkResult();
        switchPlayer();
    }
}

function switchPlayer() {
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        displayMessage(`🎮 Player ${currentPlayer}'s turn`);

        if (gameMode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 600);
        }
    }
}

function computerMove() {
    let availableMoves = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    let move = findWinningMove('O') || findWinningMove('X') || availableMoves[Math.floor(Math.random() * availableMoves.length)];

    if (move !== undefined) {
        makeMove(move);
    }
}

function findWinningMove(player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = player;
            if (checkWin(board, player)) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return null;
}

function checkResult() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            showWinner(board[a], combination);
            updateScore(board[a]);
            drawWinningLine(a, b, c);
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        const funnyDraws = [
            "It's a tie! Nobody wins, but everyone gets a trophy 🏆",
            "Draw! Like your art skills in kindergarten 🎨",
            "Womp womp... no winner, just legends.",
        ];
        displayMessage(getRandom(funnyDraws));
    }
}

function checkWin(boardToCheck, player) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winCombos.some(([a, b, c]) =>
        boardToCheck[a] === player &&
        boardToCheck[b] === player &&
        boardToCheck[c] === player
    );
}

function drawWinningLine(a, b, c) {
    const cellsArray = Array.from(cells);
    [a, b, c].forEach(index => {
        cellsArray[index].classList.add('winner');
    });

    const rectA = cellsArray[a].getBoundingClientRect();
    const rectC = cellsArray[c].getBoundingClientRect();

    winningLine = document.createElement('div');
    winningLine.classList.add('winning-line');

    const startX = rectA.left + rectA.width / 2;
    const startY = rectA.top + rectA.height / 2;
    const endX = rectC.left + rectC.width / 2;
    const endY = rectC.top + rectC.height / 2;

    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    const length = Math.hypot(endX - startX, endY - startY);

    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.left = `${startX}px`;
    winningLine.style.top = `${startY}px`;

    document.body.appendChild(winningLine);
}

function updateScore(winner) {
    if (winner === 'X') {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
    }
}

function showWinner(winner, combo) {
    const funnyMessages = {
        X: [
            "Player X wins! 🥳 X marks the win!",
            "X takes it home! 💥",
            "X got the power! ⚡️"
        ],
        O: [
            "O dominates! 😎",
            "O with the knockout punch! 🥊",
            "O just looped its way to victory! 🔄"
        ]
    };
    displayMessage(getRandom(funnyMessages[winner]));
}

function displayMessage(text) {
    message.textContent = text;
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function newGame() {
    if (winningLine) {
        winningLine.remove();
        winningLine = null;
    }
    startGame(gameMode);
}
