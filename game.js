const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const modeBtn = document.querySelector("#modeBtn");
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let gameMode = "singlePlayer";

initializeGame();
modeBtn.textContent = "Switch to Multiplayer";

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  modeBtn.addEventListener("click", changeGameMode);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] != "" || !running) {
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
  if (gameMode == "singlePlayer") {
    computerTurn();
  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];
    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    if (gameMode == "singlePlayer") {
      if (currentPlayer == "X") {
        statusText.textContent = "You Win!";
      } else {
        statusText.textContent = "Computer Wins!";
      }
    } else {
      statusText.textContent = `${currentPlayer} Wins!`;
    }
    running = false;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));
  running = true;
}

function changeGameMode() {
  if (gameMode == "singlePlayer") {
    gameMode = "multiPlayer";
    modeBtn.textContent = "Switch to Singleplayer";
  } else {
    gameMode = "singlePlayer";
    modeBtn.textContent = "Switch to Multiplayer";
  }
  restartGame();
}

function computerTurn() {
  setTimeout(() => {
    let bestMove = -1;
    let bestScore = -Infinity;

    // Evaluate possible moves
    for (let i = 0; i < options.length; i++) {
      if (options[i] == "") {
        options[i] = "O";
        let score = minimax(options, 0, false);
        options[i] = "";

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    // Make the best move
    options[bestMove] = "O";
    cells[bestMove].textContent = "O";
    checkWinner();
  }, 700);
}

// Minimax function
function minimax(options, depth, isMaximizing) {
  let winner = checkWinner(options);
  if (winner == "O") {
    return 10 - depth;
  } else if (winner == "X") {
    return depth - 10;
  } else if (!options.includes("")) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < options.length; i++) {
      if (options[i] == "") {
        options[i] = "O";
        let score = minimax(options, depth + 1, false);
        options[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < options.length; i++) {
      if (options[i] == "") {
        options[i] = "X";
        let score = minimax(options, depth + 1, true);
        options[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
function checkWinner(options) {
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];
    if (cellA == cellB && cellB == cellC) {
      return cellA;
    }
  }
  return null;
}
