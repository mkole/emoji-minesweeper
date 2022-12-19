/*
 *  Minesweeper Emoji
 *  Copyright (c) 2022 Michael Kolesidis
 *  GNU General Public License v3.0
 *
 */

document.title = `Minesweeper Emoji`;

/**
 * Elements
 */
// Header
const header = document.createElement("div");
header.className = `header`;
header.innerHTML = `
<span style="--i:1">M</span>
<span style="--i:2">i</span>
<span style="--i:3">n</span>
<span style="--i:4">e</span>
<span style="--i:5">s</span>
<span style="--i:6">w</span>
<span style="--i:7">e</span>
<span style="--i:8">e</span>
<span style="--i:9">p</span>
<span style="--i:10">e</span>
<span style="--i:11">r</span>
<span style="--i:12">&nbsp;</span>
<span style="--i:13">E</span>
<span style="--i:14">m</span>
<span style="--i:15">o</span>
<span style="--i:16">j</span>
<span style="--i:17">i</span>
`;
document.body.appendChild(header);

// Board
const board = document.createElement("div");
board.setAttribute("id", "board");
document.body.appendChild(board);

// New Game Button
const newGame = document.createElement("button");
newGame.setAttribute("id", "reload");
newGame.innerHTML = `New Game`;
document.body.appendChild(newGame);

// Stats Button
const stats = document.createElement("button");
stats.setAttribute("id", "stats");
stats.innerHTML = `Statistics`;
document.body.appendChild(stats);

// Footer
const footer = document.createElement("footer");
footer.innerHTML = `<a href="https://github.com/michaelkolesidis/minesweeper-emoji" target="_blank" rel="noopener"><img src="../assets/m.svg"/></a>`;
document.body.appendChild(footer);

/**
 * Button Functionality
 */
// Reload button functionality
function reload() {
  const reload = document.querySelector("#reload");
  reload.addEventListener("click", () => {
    window.location.reload();
  });
}
reload();

// Stats Button Functionality

/**
 * Data Storage
 */
let played = window.localStorage.getItem('played')
if (played === null)
{
    window.localStorage.setItem("played", "0")
}

let won = window.localStorage.getItem('won')
if (won === null)
{
    window.localStorage.setItem("won", "0")
}

let bestTime = window.localStorage.getItem('bestTime')
if (bestTime === null)
{
    window.localStorage.setItem("bestTime", "")
}