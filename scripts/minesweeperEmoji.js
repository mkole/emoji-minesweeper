/*
 *  Minesweeper Emoji
 *  Copyright (c) 2022 Michael Kolesidis
 *  GNU General Public License v3.0
 *
 */

// Disable the Friendly Error System
// (not used in the minified version of p5js)
disableFriendlyErrors = true;

let cnv; // The canvas element that will contain the game

// Board dimensions and number of mines
let cols = 10;
let rows = 10;
let numOfCells = rows * cols;
let cellW = 40; // The width (in pixels) of each individual cell
let cellH = 40; // The height (in pixels) of each individual cell
let cells = []; // Array to hold all the cell objects
let sizeError = 7; // On Windows and on Linux if error is not added to size,
// the left and bottom borders are not totally visible.
// On Mac it works fine even without the error

// Emojis
const WON = "😄";
const LOST = "😵";
const EMPTY = "🔲";
const MINE = "💣";
const DETONATION = "💥";
const FLAG = "🚩";
const DIGITS = ["⬜️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
const TIMER = "⌛";

// Prevent right mouse click from opening browser context menu in order to be able to flag
document.addEventListener("contextmenu", (event) => event.preventDefault());

let initialMines = 2; // Used by the mine indicator
let numberOfMines = initialMines; // Used to calculate mines to be allocated to cells
let cellCounter = 0; // The unique identifier of each cell
let minedCells = []; // A array containing the unique identifiers of all the cells that will contain mines

let flaggedCells = 0;
let startTime = null;

// Mine allocation
function allocateMines() {
  while (numberOfMines > 0) {
    let targetCell = Math.floor(Math.random() * (numOfCells - 1)) + 1;
    if (!minedCells.includes(targetCell)) {
      minedCells.push(targetCell);
      numberOfMines -= 1;
    }
  }
}

function generateCells() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let newCell = new Cell(i, j);
      newCell.num = cellCounter;
      cellCounter += 1;

      // Check whether cell includes mine
      if (minedCells.includes(newCell.num)) {
        newCell.mine = true;
      }

      cells.push(newCell);
    }
  }
}

// Calculate mines around each cell
function calculateMines() {
  cells.forEach((c) => {
    // Find neighboring cells
    let neighbors = getNeighbors(c);
    let reducer = (accumulator, currentValue) => accumulator + currentValue;
    c.minesAround = neighbors.map((n) => n.mine).reduce(reducer); // Add all mine values to find total
  });
}

// Time indicator
let timePassed = 0;
let stopTimer = false;

const startTimer = () => {
  setInterval(() => {
    if (stopTimer) {
      return;
    }
    timePassed += 1;
  }, 1000);
};

function setup() {
  background(249, 249, 249);
  cnv = createCanvas(
    cellW * cols + sizeError,
    cellH * rows + sizeError + 30 // Added 30 pixels to create space for the mines and flagged cells indicators
  );
  cnv.parent("board");
  textSize(cellH - 2); // On Mac "cellH - 1" works better, on Windows "cellH - 6"

  allocateMines();
  generateCells();
  calculateMines();
}

function draw() {
  background(255);

  translate(-3, cellH - 3);
  cells.forEach(function (c) {
    c.draw();
  });

  // Show mines and flagged cells indicators
  // fill(15, 15, 15);
  textSize(24);
  textStyle(BOLD);
  textFont("Arial");

  // Mine indicator
  if (initialMines - flaggedCells < 0) {
    fill(248, 49, 47);
  } else {
    fill(15, 15, 15);
  }
  text(MINE, 5, height - 41);
  text(nf(Math.max(initialMines - flaggedCells, 0), 3), 40, height - 40);

  // Time indicator
  text(TIMER, width - 79, height - 41);
  if (flaggedCells > initialMines) {
    fill(248, 49, 47);
  } else {
    fill(15, 15, 15);
  }
  text(nf(timePassed, 3), width - 44, height - 40);
  textSize(cellH - 2);
}

// Get neighbors
function getNeighbors(cell) {
  return cells.filter((n) => {
    return (
      n.i >= cell.i - 1 &&
      n.i <= cell.i + 1 &&
      n.j >= cell.j - 1 &&
      n.j <= cell.j + 1
    );
  });
}

let isFirstClick = true;
let mineReallocated = false;

// What happens every time the player clicks on a cell
function revealCell(cell) {
  // Make sure first click is not on a mine
  if (isFirstClick) {
    startTimer();
    startTime = new Date();

    // Update local storage
    let played = parseInt(localStorage.getItem("played"));
    localStorage.setItem("played", ++played);

    if (cell.mine) {
      cell.mine = false;

      while (!mineReallocated) {
        let num = Math.floor(Math.random() * (numOfCells - 1)) + 1;
        if (!cells[num].mine) {
          cells[num].mine = true;
          mineReallocated = true;
        }
      }
    }
    isFirstClick = false;

    calculateMines();
    cells.forEach(function (c) {
      c.draw();
    });
  }

  // Reveal cell
  cell.revealed = true;
  cell.clicked = true;
  if (cell.mine) {
    // End game
    cells.forEach((c) => {
      c.revealed = true;
    });
    noLoop();
    return;
  }
  if (cell.minesAround == 0) {
    // Recursively reveal neighbors
    let neighbors = getNeighbors(cell);
    neighbors.forEach((c) => {
      if (!c.revealed) {
        revealCell(c);
        if (c.flagged) {
          c.flagged = false;
          flaggedCells -= 1;
        }
      }
    });
  }
}

function gameWon() {
  DIGITS[0] = WON;
  cells.forEach(function (c) {
    c.revealed = true;
  });

  // Update local storage
  let won = parseInt(localStorage.getItem("won"));
  localStorage.setItem("won", ++won);

  const endTime = new Date();
  let time = endTime - startTime; //in ms
  time = time / 1000;

  let bestTime = Number(localStorage.getItem("bestTime"));
  if (bestTime === 0) {
    localStorage.setItem("bestTime", time);
  } else {
    if (time < bestTime) {
      localStorage.setItem("bestTime", time);
    }
  }

  stopTimer = true;
}

function gameLost() {
  DIGITS[0] = LOST;
  cells.forEach(function (c) {
    c.revealed = true;
  });

  const endTime = new Date();
  let time = endTime - startTime; //in ms
  time = time / 1000;
  stopTimer = true;
}

function mousePressed() {
  // Flags
  if (mouseButton === RIGHT) {
    // Find the cell pressed on
    let cell = cells.find((c) => {
      return (
        c.x < mouseX &&
        c.x + cellW > mouseX &&
        c.y < mouseY &&
        c.y + cellH > mouseY
      );
    });
    if (cell) {
      // Prevent revealed cells from being flagged
      if (!cell.flagged && !cell.revealed) {
        flaggedCells += 1;
      } else if (!cell.revealed) {
        flaggedCells -= 1;
      }
      cell.flagged = !cell.flagged;
    }
  }

  // Find the cell pressed on
  if (mouseButton === LEFT) {
    let cell = cells.find((c) => {
      return (
        c.x < mouseX &&
        c.x + cellW > mouseX &&
        c.y < mouseY &&
        c.y + cellH > mouseY
      );
    });
    if (cell) {
      if (cell.flagged) {
        return; // Do not allow revealing when flagged
      }
      revealCell(cell);
      if (cell.mine) {
        gameLost();
      } else {
        // Check if game is won
        let cellsLeft = cells.filter((c) => {
          return !c.mine && !c.revealed;
        }).length;
        if (cellsLeft == 0) {
          gameWon();
        }
      }
    }
  }
}
