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
    let availableCells = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i] == "") {
        availableCells.push(i);
      }
    }
    const randomCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    options[randomCell] = "O";
    cells[randomCell].textContent = "O";
    checkWinner();
  }, 1000); // 1000ms = 1 second delay
}
