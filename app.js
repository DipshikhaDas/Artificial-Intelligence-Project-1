const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#pieces");
const infoDisplay = document.querySelector("#info-display");
const msg = document.querySelector("#msg");

const startPieces = [
  king,
  queen,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
];

let board;

function createBoard() {
  board = new Board(6, 5);
  addOtherPieces(board, "ai");
  addOtherPieces(board, "human");
  addPawns(board, "ai");
  addPawns(board, "human");

  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.setAttribute("draggable", "true");
    square.innerHTML = startPiece;
    square.setAttribute("square-id", i);

    square.addEventListener("dragstart", dragStart);

    const row = Math.floor((29 - i) / 5);
    const col = i % 5;

    square.setAttribute("row-id", row);
    square.setAttribute("col-id", col);
    square.classList.add("square");

    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "gray" : "green");
    } else {
      square.classList.add(i % 2 === 0 ? "gray" : "green");
    }
    gameBoard.append(square);

    if (i <= 9) {
      square.firstChild.firstChild.classList.add("black");
    }

    if (i >= 20) {
      square.firstChild.firstChild.classList.add("white");
    }
  });
}

function addOtherPieces(board, player) {
  let row = player === "ai" ? 5 : 0;
  let col = player === "ai" ? 0 : 4;

  let changeCol = (player, col) => {
    return player === "ai" ? ++col : --col;
  };
  board.addPiece(new King(player, row, col), row, col);
  col = changeCol(player, col);
  board.addPiece(new Queen(player, row, col), row, col);
  col = changeCol(player, col);
  board.addPiece(new Bishop(player, row, col), row, col);
  col = changeCol(player, col);
  board.addPiece(new Knight(player, row, col), row, col);
  col = changeCol(player, col);
  board.addPiece(new Rook(player, row, col), row, col);
}

function addPawns(board, player) {
  let row = player === "ai" ? 4 : 1;

  for (let i = 0; i < 5; i++) {
    board.addPiece(new Pawn(player, row, i), row, i);
  }
}

let moves = 0;
let currentPlayer = "human";

function changePlayer() {
  moves++;
  currentPlayer = moves % 2 == 0 ? "human" : "ai";
  infoDisplay.innerHTML = `current player: <b>${currentPlayer}</b>`;
  msg.innerHTML = '';
  //   console.log(infoDisplay);
}

createBoard();

function movePieces(fromRow, fromCol, toRow, toCol) {
  const ret = board.movePiece(
    Number(fromRow),
    Number(fromCol),
    Number(toRow),
    Number(toCol),
    currentPlayer
  );
  if (!ret.status) {
    const fromCell = document.querySelector(
      `[row-id="${fromRow}"][col-id="${fromCol}"]`
    );
    const toCell = document.querySelector(
      `[row-id="${toRow}"][col-id="${toCol}"]`
    );
    toCell.innerHTML = "";
    const clone = fromCell.firstChild.cloneNode(true);

    toCell.appendChild(clone);
    fromCell.innerHTML = "";
    //   console.log(fromCell.firstChild);
    changePlayer();

    if (currentPlayer === "ai") {
      setTimeout(function () {
        aiMove();
      }, 2);
    }
    // if (currentPlayer === "human") {
    //     aiMove();
    // }
  } else {
    console.log(ret);
    msg.innerHTML = ret.message;
  }
}

const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  // square.addEventListener('dragstart', dragStart);
  square.addEventListener("click", dragStart);
});

let dragStartRow, dragStartCol;

function dragStart(e) {
  const square = e.target.closest(".square");
  dragStartRow = square.getAttribute("row-id");
  dragStartCol = square.getAttribute("col-id");
}

allSquares.forEach((square) => {
  square.addEventListener("dragover", allowDrop);
});

function allowDrop(e) {
  e.preventDefault();
}

allSquares.forEach((square) => {
  square.addEventListener("drop", dropPieces);
});

function dropPieces(e) {
  // e.preventDefault();
  const square = e.target.closest(".square");
  const dropRow = square.getAttribute("row-id");
  const dropCol = square.getAttribute("col-id");

  if (currentPlayer === "human") {
    movePieces(dragStartRow, dragStartCol, dropRow, dropCol);
  }

  // console.log(dragStartRow, dragStartCol);
}

const testMoves = [
  [1, 2, 3, 2], // human pawn
  [4, 0, 2, 0], // ai pawn
  [3, 2, 4, 1], // human pawn, ai in check
];
function test() {
  // board.movePiece(1,3,3,3, currentPlayer);
  const move = testMoves[moves];
  movePieces(move[0], move[1], move[2], move[3]);
}

function test2(cnt) {
  for (let i = 0; i < cnt; i++) {
    const move = testMoves[i];
    movePieces(move[0], move[1], move[2], move[3]);
  }
}
