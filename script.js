"use strict";

// Game module pattern function
const Game = (function () {
  return "test";
})();

console.log(Game);

// Player factory function
const createPlayer = function (name, marker) {
  let score = 0;

  function makeMove() {}
};

const createGameBoard = function (rows, columns) {
  let board = new Array(rows);
  init();

  // Initialize gameboard
  function init() {
    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(columns);
    }
  }

  return { board };
};

// create a game board
const board = createGameBoard(3, 4);

// create two players
const player1 = createPlayer("Simeon", "X");
const player2 = createPlayer("Darina", "O");
