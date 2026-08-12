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

  function getBoard() {
    return board;
  }

  return { init, getBoard, clearBoard, isPositionTaken, isFull, getRowsAndCols, makeMove, has3InARow };
};

// Game module pattern function
const createGame = function () {
  let board, players, currentPlayer;

  /**
   *  Initialize a game
   */
  function startGame(...newPlayers) {
    console.log("Starting a game...");
    // init game state
    board = createGameBoard(3, 3);
    board.init();
    players = newPlayers;
    currentPlayer = 0;
  }

  /**
   * Players' plays a turn on the board
   * @param {number} rowIdx board row index
   * @param {number} colIdx board column index
   * @returns "pending" if game no game ending move || "positionTaken" if position is already taken || "winner" if winner is present || "draw" if game ends in a draw
   */
  function playerTurn(rowIdx, colIdx) {
    // input validation
    if (!validatePlayerInput(rowIdx, colIdx)) return;

    // Position already filled?
    if (board.isPositionTaken(rowIdx, colIdx)) {
      return "positionTaken";
    }

    // Current player makes move
    board.makeMove([rowIdx, colIdx], players[currentPlayer].getMarker());

    // check if 3 in a row?
    if (handleCase3InARow()) return "winner";

    // check if board is full
    if (handleCaseBoardFull()) return "draw";

    // switch player turn
    currentPlayer = 1 - currentPlayer;

    return "pending";
  }

  function validatePlayerInput(rowIdx, colIdx) {
    const isValidTurn = (rowIdx, colIdx, rows, columns) => {
      return rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < columns;
    };

    const { rows, columns } = board.getRowsAndCols();
    if (!isValidTurn(rowIdx, colIdx, rows, columns)) {
      console.error("Please provide a row index and column index within the range");
      return false;
    }

    return true;
  }

  function handleCase3InARow() {
    if (board.has3InARow(players[currentPlayer].getMarker())) {
      players[currentPlayer].incrementScore();
      board.clearBoard();
      return true;
    }
    return false;
  }

  function handleCaseBoardFull() {
    if (board.isFull()) {
      board.clearBoard();
      return true;
    }
    return false;
  }

  // gettter and setter methods
  function getBoardGrid() {
    return board.getBoard();
  }

  function getPlayersInfo() {
    return players.map(getPlayerInfo);
  }

  function getWinningPlayerInfo() {
    const winner = players[currentPlayer];
    return getPlayerInfo(winner);
  }

  function getPlayerInfo(player) {
    return { name: player.getName(), score: player.getScore(), marker: player.getMarker() };
  }

  return { startGame, playerTurn, getBoardGrid, getPlayersInfo, getWinningPlayerInfo };
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
  const state = "home";

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
    switchScreen("game"); // could have used a high-order function as well to handle this (closure) as well but this is good.
  }

  function handleGridElClick(e) {
    const gridEl = e.target.closest(".btn--grid");
    if (!gridEl) return;
    const [row, col] = [gridEl.dataset.row, gridEl.dataset.col];

    // note: so now we have to check for pos taken? 3 in a row, board full etc etc. But.. instead of doing it here, we have separated the logic inside its own class (SEPARATION OF CONCERNS). So, the DOM controller has its own responsibities and can only interact through the API and read things to dipslay stuff in the UI. (it is the outer world gateway which interacts with the application logic and state.) Those are essentially internal state checks and settings things (like swtiching player internally) which are all the responsibility of the domain modeling classes. As you can see below, instead of doing all this, we just provide input from the DOM into the game class to actually modify all this state internally instead.

    const turnResult = game.playerTurn(row, col, positionTakenAnimation);
    switch (turnResult) {
      case "positionTaken":
        positionTakenAnimation(row, col);
        break;
      case "winner":
        switchScreen("endRoundWinner");
        break;
      case "draw":
        switchScreen("endRoundDraw");
        break;
      case "pending":
        switchScreen("game");
        switchActivePlayer();
      default:
        break;
    }
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
  }

  function switchActivePlayer() {
    playerCards.forEach(playerCard => playerCard.classList.toggle("player-card--active"));
  }

  /**
   * Show the screen based on what state it is ine
   * @param {string} state home || endRoundWinner || endRoundDraw || game
   */
  function switchScreen(newState) {
    state = newState;

    // change screen displayed
    modifyClassesByScreenState(state);

    // change content based on screen state
    if (state === "game") {
      showGrid(game.getBoardGrid());
      // showGrid(game.getBoardGrid());
    }
    if (state === "endRoundWinner") {
      changeEndRoundContent(true);
    }
    if (state === "endRoundDraw") {
      changeEndRoundContent(false);
    }

    populatePlayerCards();
  }

  /**
   * Modify CSS classes to change screen shown
   * @param {string} state State of the screen to display
   */
  function modifyClassesByScreenState(screenState) {
    if (screenState === "game") {
      startContainer.classList.add("hidden");
      playContainer.classList.remove("hidden");
      resetBtn.classList.add("hidden");
      playerCardsEndScreenContainer.classList.add("hidden-none");
      playerCards[0].classList.add("player-card--active");
      playerCards[1].classList.remove("player-card--active");
    }

    if (screenState === "home") {
      startContainer.classList.remove("hidden");
      playContainer.classList.add("hidden");
      resetBtn.classList.add("hidden");
      playerCardsEndScreenContainer.classList.add("hidden-none");
    }

    if (screenState === "endRoundWinner" || screenState === "endRoundDraw") {
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
    const title = startContainer.querySelector(".heading-primary");
    const desc = startContainer.querySelector(".desc");

    // in case of winner
    if (hasWinner) {
      const winningPlayer = game.getWinningPlayerInfo();
      const winnerName = winningPlayer.name;

      title.textContent = `${winnerName} won this round!`;
      desc.textContent = "Play another round or reset the game";
      return;
    }

    // in case of draw
    title.textContent = "This round was a draw!";
    desc.textContent = "Play another round or reset the game";
  }

  /**
   * Populate playcards with player names and scores
   */
  function populatePlayerCards() {
    const players = game.getPlayersInfo();
    console.log(players);

    const populateCard = (card, idx) => {
      const player = players[idx];
      card.querySelector(".player-name").textContent = player.name;
      card.querySelector(".player-score").textContent = player.score;
    };

    playerCards.forEach(populateCard);
    playerCardsEndScreenContainer.querySelectorAll(".player-card").forEach(populateCard);
  }
})();
