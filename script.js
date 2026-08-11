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
    board = generateArray(rows, columns);
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
    const arr = new Array(rows);

    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols).fill(value);
    }

    return arr;
  }

  /**
   * Makes a move on the board
   * @param {Array} coords row and col coordinates
   * @param {string} marker Marker to apply on the coords
   */
  function makeMove(coords, marker) {
    board[coords[0]][coords[1]] = marker;
  }

  /**
   * Checks if the current player has 3 in a row somewhere.
   * @param {string} currentPlayerMarker Marker of the current player
   */
  function has3InARow(currentPlayerMarker) {
    const marker = currentPlayerMarker;
    const getMarkerCoords = () =>
      board.reduce((idxArr, row, i) => {
        row.forEach((el, j) => el === marker && idxArr.push(`${i},${j}`));
        return idxArr;
      }, []);
    const checkMatch = (direction = "vertical", coords) => {
      return coords.some((str, idx, arr) => {
        const [row, col] = str.split(",");
        const checkNextCoordsArr = Array.from({ length: 3 }, (_, i) => {
          const position =
            direction === "horizontal"
              ? `${row},${+col + i}`
              : direction === "vertical"
                ? `${+row + i},${col}`
                : direction === "diagonalLeftUpDown"
                  ? `${+row + i},${+col + i}`
                  : direction === "diagonalLeftDownUp"
                    ? `${+row - i},${+col + i}`
                    : "";
          return arr.includes(position);
        });

        return checkNextCoordsArr.every(Boolean);
      });
    };

    const markerCoords = getMarkerCoords();
    // console.log(checkMatch("horizontal", markerCoords));
    // console.log(checkMatch("vertical", markerCoords));
    // console.log(checkMatch("diagonalLeftUpDown", markerCoords));
    // console.log(checkMatch("diagonalLeftDownUp", markerCoords));

    return [
      checkMatch("horizontal", markerCoords),
      checkMatch("vertical", markerCoords),
      checkMatch("diagonalLeftUpDown", markerCoords),
      checkMatch("diagonalLeftDownUp", markerCoords),
    ].some(Boolean);

    // check for row match
    // const leftToRight = checkHorizontal(markerCoords);
    // console.log(leftToRight);
    // const verticalMatch = checkVertical(markerCoords);
    // console.log(verticalMatch);

    // leftToRight = markerCoords.reduce
  }

  function clearBoard() {
    board = generateArray(rows, columns);
  }

  /**
   * Checks if a position is already filled or not
   * @param {number} row Row number to check
   * @param {number} col Column number to checdk
   */
  function isPositionTaken(row, col) {
    if (board[row][col] === "") return false;
    return true;
  }

  /**
   * Function to check if a board is filled or not
   * @returns true if full, false otherwise
   */
  function isFull() {
    return board.every(row => row.every(col => col !== ""));
  }

  // getter and setter methods
  function getRowsAndCols() {
    return { rows, columns };
  }

  return { init, printBoard, clearBoard, isPositionTaken, isFull, getRowsAndCols, makeMove, has3InARow };
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
   * Play a round of tic tac toe
   */
  function playRound() {
    const { rows, cols } = board.getRowsAndCols();

    while (true) {
      const position = prompt(
        `Please provide a , separated position (e.g. 1,2 = row,col) from 1 to ${rows} for rows and from 1 to ${cols} for columns`,
      );

      const [row, col] = position.split(",").map(pos => +pos - 1);

      // player takes turn
      playerTurn(row, col);
    }
  }

  /**
   * Players' plays a turn on the board
   *
   */
  function playerTurn(rowIdx, colIdx) {
    // input validation
    const { rows, columns } = board.getRowsAndCols();
    if (!isValidTurn(rowIdx, colIdx, rows, columns)) {
      displayMessage("Please provide a row index and column index within the range");
      return;
    }

    // Position already filled?
    if (board.isPositionTaken(rowIdx, colIdx)) {
      displayMessage("Position has already been taken, please provide another!");
      return;
    }

    // Current player makes move
    board.makeMove([rowIdx, colIdx], players[currentPlayer].getMarker());

    // check if 3 in a row?
    if (board.has3InARow(players[currentPlayer].getMarker())) {
      displayMessage(`${players[currentPlayer].getName()} with marker ${players[currentPlayer].getMarker()} has 3 in a row!`);
      board.printBoard();
      return;
    }

    // check if board is full
    if (board.isFull()) {
      displayMessage("The board is full... a draw!");
      board.printBoard();
      return;
    }

    // switch player turn
    currentPlayer = 1 - currentPlayer;

    // dipslay new player's turn messgae
    console.log(`${players[currentPlayer].getName()}'s turn`);

    // display board again
    board.printBoard();
  }

  function isValidTurn(rowIdx, colIdx, rows, columns) {
    return rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < columns;
  }

  function displayMessage(message) {
    console.log(message);
  }

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

  function playDemoGame() {
    game.playerTurn(2, 2);
    // p2
    game.playerTurn(1, 0);
    // p3
    game.playerTurn(2, 1);
    // p4

    game.playerTurn(1, 0);
    // p5
    game.playerTurn(2, 0);
    game.playerTurn(1, 1);
    // p6
    game.playerTurn(1, 2);
    game.playerTurn(1, 1);
    game.playerTurn(0, 2);
    game.playerTurn(0, 1);
    game.playerTurn(0, 0);
    console.log(board.has3InARow(players[currentPlayer].getMarker()));
  }

  function playDemoGameDiagonal() {
    board.clearBoard();
    game.playerTurn(0, 0);
    game.playerTurn(0, 1);
    game.playerTurn(1, 1);
    game.playerTurn(1, 0);
    game.playerTurn(2, 2);
    game.playerTurn(2, 1);
    game.playerTurn(2, 0);
    game.playerTurn(1, 0);
    game.playerTurn(0, 2);
    console.log(board.has3InARow(players[currentPlayer].getMarker()));
  }

  return { startGame, playRound, playDemoGame, playDemoGameDiagonal, getBoard, getPlayersScore, getPlayers, playerTurn };
})();

// start a game
game.startGame(createPlayer("Simeon", "O"), createPlayer("Darina", "X"));
// game.playerTurn(4, 4);
// game.playerTurn(-4, 4);
// game.playerTurn(undefined, 4);
// p1
// game.playDemoGame();
// game.playDemoGameDiagonal();

// testing cases in the game...
game.playRound();
