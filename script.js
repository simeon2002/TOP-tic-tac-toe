"use strict";

// Player factory function
const createPlayer = function (name, marker) {
  let score = 0;

  function getScore() {
    return score;
  }

  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  function printPlayerInfo() {
    console.log(`${name}: ${marker}`);
  }

  return { getScore, getName, getMarker, printPlayerInfo };
};

const createGameBoard = function (rows, columns) {
  let board;

  // Initialize gameboard
  function init() {
    generateArray(rows, columns);
  }

  /**
   * Print board
   */
  function printBoard() {
    const boardStr = board.reduce((str, row) => {
      str += printCols(row) + "\n";
      return str;
    }, "");
    console.log(boardStr);
  }

  /**
   * Print columns with additonal padding to format the column nicely
   * @param {number} row row array to print columns from
   * @param {number} padCount max length of the string, default = 6
   * @param {string} padValue Value to pad with, default = " "
   * @param {string} separator Value to separate the columns with
   * @returns
   */
  function printCols(row, padCount = 6, padValue = " ", separator = "|") {
    // const subStr = " ".padEnd(padCount, padValue);
    let str = row
      .reduce((str, el) => str + el.padStart(padCount / 2, padValue).padEnd(padCount, padValue) + separator, "")
      .padEnd(padCount, padValue);
    return str;
  }

  /**
   * Generates a new array with row rows and cols columns
   * @param {number} row number of rows for the array
   * @param {number} cols Number of columns for the array
   * @param {any} value Value to fill within
   */
  function generateArray(row = 3, cols = 3, value = "") {
    board = new Array(rows);

    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(cols).fill(value);
    }
  }

  return { init, printBoard };
};

// Game module pattern function
const game = (function () {
  let board, players, currentPlayer;

  // Initialize a game
  function startGame(...newPlayers) {
    // init state
    board = createGameBoard(3, 3);
    board.init();
    players = newPlayers;
    currentPlayer = 0;

    displayInitialState();
  }

  function displayInitialState() {
    console.log("Starting a game...");
    players.forEach(player => player.printPlayerInfo());
    board.printBoard();
  }

  /**
   * Players' plays a turn on the board
   *
   */

  // gettter and setter methods
  function getBoard() {
    return board;
  }

  function getPlayersScore() {
    return players.map(player => ({ [player.getName()]: player.getScore() }));
  }

  function getPlayers() {
    return players;
  }

  return { startGame, getBoard, getPlayersScore, getPlayers };
})();

// start a game
game.startGame(createPlayer("Simeon", "O"), createPlayer("Darina", "X"));
