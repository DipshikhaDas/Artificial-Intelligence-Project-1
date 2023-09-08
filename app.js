const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#pieces");
const infoDisplay = document.querySelector("#info-display");

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

// function createBoard(){
//     startPieces.forEach((startPiece, i) =>{
//         const square = document.createElement('div')
//         square.innerHTML = startPiece
//         square.setAttribute('square-id', i)

//         const row = Math.floor((63-i) / 8) + 1

//         if(row%2 ===0){
//             square.classList.add(i%2 ===0 ? "green" : "gray")
//         }else{
//             square.classList.add(i%2 ===0 ? "gray" : "green")
//         }
//         square.classList.add('square')
//         gameBoard.append(square)

//         if(i<=15){
//            square.firstChild.firstChild.classList.add('black')
//         }

//         if(i>=48){
//             square.firstChild.firstChild.classList.add('white')
//         }
//     })
// }

// const board = new Board(6, 5);
let board;

function createBoard() {
  board = new Board(6, 5);
  addOtherPieces(board, "ai");
  addOtherPieces(board, "human");
  addPawns(board, "ai");
  addPawns(board, "human");

  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.innerHTML = startPiece;
    square.setAttribute("square-id", i);

    const row = Math.floor((29 - i) / 5);
    const col = i % 5;

    square.setAttribute("row-id", row);
    square.setAttribute("col-id", col);

    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "gray" : "green");
    } else {
      square.classList.add(i % 2 === 0 ? "gray" : "green");
    }
    square.classList.add("square");
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

createBoard();

function movePieces(fromRow, fromCol, toRow, toCol) {
  if (
    !board.isInBoard(fromRow, fromCol) || 
    !board.isInBoard(toRow, toCol)
    ) {
    console.log("Inavalid Loations");
    return;
  }

  const tempCell = document.querySelector(`[row-id="${fromRow}"][col-id="${fromCol}"]`);
  console.log(tempCell);
  
}
