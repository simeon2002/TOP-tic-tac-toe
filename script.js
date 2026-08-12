"use strict";

// Player factory function
const createPlayer = function (name, marker) {
  let score = 0;

  function getScore() {
    return score;
  }

  function incrementScore() {
    score++;
  }

  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  function printPlayerInfo() {
    console.log(`${name} (${marker}): ${score} points`);
  }

  return { getScore, incrementScore, getName, getMarker, printPlayerInfo };
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

  function isCellEmpty(row, col) {
    return board[row][col] === "";
  }

  // getter and setter methods
  function getRowsAndCols() {
    return { rows, columns };
  }

  function getBoard() {
    return board;
  }

  return { init, printBoard, getBoard, clearBoard, isCellEmpty, isPositionTaken, isFull, getRowsAndCols, makeMove, has3InARow };
};

// Game module pattern function
const createGame = function () {
  let board, players, currentPlayer;

  /**
   *  Initialize a game
   */
  function startGame(...newPlayers) {
    console.log("Starting a game...");
    // init state
    board = createGameBoard(3, 3);
    board.init();
    players = newPlayers;
    currentPlayer = 0;

    // Start a round
    // while (true) {
    //   const playRoundFlag = confirm("Start a round");
    //   if (playRoundFlag) {
    //     console.log("Starting a round...");
    //     setTimeout(() => {
    //       playRoundDemo();
    //     }, 5000);
    //     break;
    //   }
    // }
  }

  /**
   * Displays initial state of the board
   */
  function displayGameState() {
    players.forEach(player => player.printPlayerInfo());
    board.printBoard();
  }

  /**
   * Play a round of tic tac toe
   */
  function playRoundDemo() {
    const { rows, cols } = board.getRowsAndCols();
    board.clearBoard();
    displayGameState();

    while (true) {
      const position = prompt(
        `Please provide a , separated position (e.g. 1,2 = row,col) from 1 to ${rows} for rows and from 1 to ${cols} for columns`,
      );

      const [row, col] = position.split(",").map(pos => +pos - 1);

      // player takes turn
      const gameEndedFlag = playerTurn(row, col);
      // temporary to start another round
      if (gameEndedFlag) {
        const nextStep = prompt("type 'play' to play another round, else game is reset");
        if (nextStep !== "play") {
          // resetGame()
          console.log("Ending game....");
          break;
        }
        playRoundDemo(); // playing a round using recursion
        break;
      }
    }
  }

  /**
   * Players' plays a turn on the board (with console)
   *
   */
  function playerTurnDemo(rowIdx, colIdx) {
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
      players[currentPlayer].incrementScore();
      displayGameState();
      return true;
    }

    // check if board is full
    if (board.isFull()) {
      displayMessage("The board is full... a draw!");
      board.printBoard();
      return true;
    }

    // switch player turn
    currentPlayer = 1 - currentPlayer;

    // dipslay new player's turn messgae
    console.log(`${players[currentPlayer].getName()}'s turn`);

    // display board again
    board.printBoard();
  }

  /**
   * Players' plays a turn on the board
   *
   */
  function playerTurn(rowIdx, colIdx, handlePositionTaken, displayGrid, switchScreen) {
    // input validation
    const { rows, columns } = board.getRowsAndCols();
    if (!isValidTurn(rowIdx, colIdx, rows, columns)) {
      displayMessage("Please provide a row index and column index within the range");
      return;
    }

    // Position already filled?
    if (board.isPositionTaken(rowIdx, colIdx)) {
      displayMessage("Position has already been taken, please provide another!");
      handlePositionTaken(rowIdx, colIdx);
      return;
    }

    // Current player makes move
    board.makeMove([rowIdx, colIdx], players[currentPlayer].getMarker());

    // check if 3 in a row?
    if (board.has3InARow(players[currentPlayer].getMarker())) {
      displayMessage(`${players[currentPlayer].getName()} with marker ${players[currentPlayer].getMarker()} has 3 in a row!`);
      players[currentPlayer].incrementScore();
      displayGrid(board.getBoard());
      console.log("dispaying winning screen");
      switchScreen("endRoundWinner");
      board.clearBoard();
      displayGameState();
      return true;
    }

    // check if board is full
    if (board.isFull()) {
      displayMessage("The board is full... a draw!");
      switchScreen("endRoundDraw");
      board.printBoard();
      return true;
    }

    // switch player turn
    currentPlayer = 1 - currentPlayer;

    // dipslay new player's turn messgae
    console.log(`${players[currentPlayer].getName()}'s turn`);

    // display board again
    board.printBoard();
    displayGrid(board.getBoard());
  }

  function isValidTurn(rowIdx, colIdx, rows, columns) {
    return rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < columns;
  }

  function displayMessage(message) {
    console.log(message);
  }

  // gettter and setter methods
  function getBoardGrid() {
    return board.getBoard();
  }

  function isCellEmpty(row, col) {
    return board.isCellEmpty(row, col);
  }

  function getPlayersScore() {
    return players.map(player => ({ [player.getName()]: player.getScore() }));
  }

  function getPlayers() {
    return players;
  }

  function getWinningPlayer() {
    return players[currentPlayer];
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

  return { startGame, playerTurn, getBoardGrid, isCellEmpty, getPlayersScore, getPlayers, getWinningPlayer };
};

const screenController = (function () {
  let game;
  const playBtn = document.querySelector(".btn--play");
  const resetBtn = document.querySelector(".btn--reset");
  const startContainer = document.querySelector(".start-container");
  const playContainer = document.querySelector(".play-container");
  const gameGrid = playContainer.querySelector(".grid--game");
  const playerCards = playContainer.querySelectorAll(".player-card");
  const playerCardsEndScreenContainer = startContainer.querySelector(".player-scores");

  init();

  function init() {
    // Initiate a game
    game = createGame();
    game.startGame(createPlayer("Simeon", "X"), createPlayer("Darina", "O"));

    // initialize event handlers
    playBtn.addEventListener("click", handlePlayBtnClick);
    gameGrid.addEventListener("click", handleGridElClick);
  }

  function handlePlayBtnClick(e) {
    // (for now only handle initial game state)
    showGrid(game.getBoardGrid());
    switchScreen("game");
  }

  function handleGridElClick(e) {
    const gridEl = e.target.closest(".btn--grid");
    const [row, col] = [gridEl.dataset.row, gridEl.dataset.col];
    console.log(gridEl);

    // note: so now we have to check for pos taken? 3 in a row, board full etc etc. But.. instead of doing it here, we have separated the logic inside its own class (SEPARATION OF CONCERNS). So, the DOM controller has its own responsibities and can only interact through the API and read things to dipslay stuff in the UI. (it is the outer world gateway which interacts with the application logic and state.) Those are essentially internal state checks and settings things (like swtiching player internally) which are all the responsibility of the domain modeling classes. As you can see below, instead of doing all this, we just provide input from the DOM into the game class to actually modify all this state internally instead.

    game.playerTurn(row, col, positionTakenAnimation, showGrid, switchScreen);
  }

  /**
   * Create a grid programmatically to dipslay on the screen with any grid size
   * @param {array} board 2D board grid
   */
  function showGrid(board) {
    let html = "";
    const [rows, columns] = [board.length, board[0].length];
    console.log(board);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        html += `<div class="btn--grid" tabindex="0" role="button" data-row="${i}" data-col="${j}">
        <span>${board[i][j]}</span></div>`;
      }
    }

    gameGrid.innerHTML = "";
    gameGrid.insertAdjacentHTML("afterbegin", html);
    switchActivePlayer();
  }

  function switchActivePlayer() {
    playerCards.forEach(playerCard => playerCard.classList.toggle("player-card--active"));
  }

  /**
   * Show the screen based on what state it is ine
   * @param {string} state home || endRoundWinner || endRoundDraw || game
   */
  function switchScreen(state) {
    modifyClassesByScreenState(state);

    if (state === "endRoundWinner") changeEndRoundContent(true);
    if (state === "endRoundDraw") changeEndRoundContent(false);

    populatePlayerCards();
  }

  /**
   * Modify CSS classes to change screen shown
   * @param {string} state State of the screen to display
   */
  function modifyClassesByScreenState(state) {
    if (state === "game") {
      startContainer.classList.add("hidden");
      playContainer.classList.remove("hidden");
      resetBtn.classList.add("hidden");
      playerCardsEndScreenContainer.classList.add("hidden-none");
      playerCards[0].classList.add("player-card--active");
      playerCards[1].classList.remove("player-card--active");
    }

    if (state === "home") {
      startContainer.classList.remove("hidden");
      playContainer.classList.add("hidden");
      resetBtn.classList.add("hidden");
      playerCardsEndScreenContainer.classList.add("hidden-none");
    }

    if (state === "endRoundWinner" || state === "endRoundDraw") {
      startContainer.classList.remove("hidden");
      playContainer.classList.add("hidden");
      playerCardsEndScreenContainer.classList.remove("hidden-none");
      resetBtn.classList.remove("hidden");
    }
  }

  function positionTakenAnimation(row, col) {
    const gridEl = gameGrid.querySelector(`.btn--grid[data-row="${row}"][data-col="${col}"]`);
    console.log(gridEl);

    const shake = [
      { transform: "translate(1px, 1px) rotate(0deg)" },
      { transform: "translate(-1px, -2px) rotate(-1deg)" },
      { transform: "translate(-3px, 0px) rotate(1deg)" },
      { transform: "translate(3px, 2px) rotate(0deg)" },
      { transform: "translate(1px, -1px) rotate(1deg)" },
      { transform: "translate(-1px, 2px) rotate(-1deg)" },
      { transform: "translate(-3px, 1px) rotate(0deg)" },
      { transform: "translate(3px, 1px) rotate(-1deg)" },
      { transform: "translate(-1px, -1px) rotate(1deg)" },
      { transform: "translate(1px, 2px) rotate(0deg)" },
      { transform: "translate(1px, -2px) rotate(-1deg)" },
    ];

    const shakeTiming = {
      duration: 500,
      iterations: 1,
    };

    gridEl.animate(shake, shakeTiming);
  }

  function changeEndRoundContent(hasWinner) {
    // input validation
    if (typeof hasWinner !== "boolean") console.log("Please provide a boolean value");

    // dispay end screen
    switchScreen("endRound");

    if (hasWinner) {
      const winningPlayer = game.getWinningPlayer();
      const winnerName = winningPlayer.getName();

      const title = startContainer.querySelector(".heading-primary");
      const desc = startContainer.querySelector(".desc");
      title.textContent = `${winnerName} won this round!`;
      desc.textContent = "Play another round or reset the game";
      return;
    }

    // in case of draw
  }

  /**
   * Populate playcards with player names and scores
   */
  function populatePlayerCards() {
    const players = game.getPlayers();
    console.log(players);

    const populateCard = (card, idx) => {
      const player = players[idx];
      card.querySelector(".player-name").textContent = player.getName();
      card.querySelector(".player-score").textContent = player.getScore();
    };

    playerCards.forEach(populateCard);
    playerCardsEndScreenContainer.querySelectorAll(".player-card").forEach(populateCard);
  }
})();

// start a game
// game.startGame(createPlayer("Simeon", "O"), createPlayer("Darina", "X"));

// game.playerTurn(4, 4);
// game.playerTurn(-4, 4);
// game.playerTurn(undefined, 4);
// p1
// game.playDemoGame();
// game.playDemoGameDiagonal();

// testing cases in the game...
// game.playRound();
