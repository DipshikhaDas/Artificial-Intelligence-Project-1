class Board {
  constructor(rows, cols) {
    this._maxRows = rows;
    this._maxCols = cols;
    this.board = [];
    this.humanPoints = 0;
    this.aiPoints = 0;
    this.humanInCheck = false;
    this.aiInCheck = false;
    this.humanCheckmate = false;
    this.aiCheckmate = false;

    for (let i = 0; i < rows; i++) {
      this.board.push([]);
      for (let j = 0; j < cols; j++) {
        this.board[i].push(null);
      }
    }
  }

  /**
   *
   * @returns A cloned copy of Board.
   */
  clone() {
    const cloneBoard = new Board(this._maxRows, this._maxCols);

    for (let row = 0; row < this._maxRows; row++) {
      for (let col = 0; col < this._maxCols; col++) {
        const piece = this.board[row][col];
        if (piece) {
          let clonePiece;
          if (piece.name === "king") {
            clonePiece = new King(piece.player, piece.row, piece.col);
          } else if (piece.name === "queen") {
            clonePiece = new Queen(piece.player, piece.row, piece.col);
          } else if (piece.name === "rook") {
            clonePiece = new Rook(piece.player, piece.row, piece.col);
          } else if (piece.name === "bishop") {
            clonePiece = new Bishop(piece.player, piece.row, piece.col);
          } else if (piece.name === "knight") {
            clonePiece = new Knight(piece.player, piece.row, piece.col);
          } else if (piece.name === "pawn") {
            clonePiece = new Pawn(piece.player, piece.row, piece.colr);
            clonePiece._firstMove = piece._firstMove;
          }

          clonePiece.row = piece.row;
          clonePiece.col = piece.col;
          cloneBoard.addPiece(clonePiece, row, col);
        }
      }
    }
    cloneBoard.humanCheckmate = this.humanCheckmate;
    cloneBoard.aiCheckmate = this.aiCheckmate;
    cloneBoard.humanPoints = this.humanPoints;
    cloneBoard.aiPoints = this.aiPoints;
    cloneBoard.humanInCheck = this.humanInCheck;
    cloneBoard.aiInCheck = this.aiInCheck;

    return cloneBoard;
  }
  /**
   * adds a piece into the desired location.
   * also adds up the points of the piece.
   * @param {Piece} piece
   * @param {number} row
   * @param {number} col
   *
   */
  addPiece(piece, row, col) {
    if (this.isInBoard(row, col)) {
      this.board[row][col] = piece;

      if (piece.player === "ai") {
        this.aiPoints += piece._points;
      } else {
        this.humanPoints += piece._points;
      }
    }
  }

  /**
   *
   * @param {number} fromRow
   * @param {number} fromCol
   * @param {number} toRow
   * @param {number} toCol
   * @param {string} player
   * @returns a status and a message
   */
  movePiece(fromRow, fromCol, toRow, toCol, player) {
    if (!this.isInBoard(fromRow, fromCol) || !this.isInBoard(toRow, toCol)) {
      // console.log("Inavalid Loations");
      return { status: -1, message: "Invalid Locations" };
    }

    if (this.isCellEmpty(fromRow, fromCol)) {
      return { status: -1, message: "Select a cell with a chess piece" };
    }

    if (this.board[fromRow][fromCol].player != player) {
      return { status: -1, message: "Select your own piece" };
    }

    const fromPiece = this.board[fromRow][fromCol];
    const validCells = fromPiece.validCells(this);
    const toCellObject = { row: toRow, col: toCol };
    const toPiece = this.board[toRow][toCol];
    // console.log(toCellObject, validCells, this.isMoveValid(toCellObject, validCells));

    // console.log(fromPiece);

    if (!this.isMoveValid(toCellObject, validCells)) {
      return {
        status: -1,
        message: "Cannot move to an invalid cell",
        validCells: validCells,
      };
    }

    const oppositionPlayer = this._getOppositionPlayer(player);
    if (!this.isCellEmpty(toRow, toCol) && toPiece.name === "king") {
      return { status: -1, message: "Cannot Capture King" };
    }
    if (fromPiece.name === "king") {
      // your king will be in check
      if (this.willKingBeInCheck(fromRow, fromCol, toRow, toCol, oppositionPlayer)) {
        return {
          status: -1,
          message: "Your king will be in check if you move to this location",
        };
      }
    }

    const temp1 = this.board[fromRow][fromCol];
    const temp2 = this.board[toRow][toCol];

    this.board[toRow][toCol] = temp1;
    this.board[fromRow][fromCol] = null;

    temp1.row = toRow;
    temp1.col = toCol;

    const isMyKingInCheck = this.myKingIncheck(player);

    this.board[fromRow][fromCol] = temp1;
    this.board[toRow][toCol] = temp2;
    temp1.row = fromRow;
    temp1.col = fromCol;

    if (isMyKingInCheck) {
      return {
        status: -1,
        message: "Your king will be in check if you make this move",
      };
    }
    this.setCheckStatus(player, false);
    if (this.getPlayerPoins(player) < 900) {
      this.restoreKingPoints(player);
    }

    this._movePiece(fromRow, fromCol, toRow, toCol, oppositionPlayer);

    return { status: 0, message: "Piece Moved" };
  }

  /**
   *
   * @param {string} player
   * @returns {Array} All possible moves of a player.
   */
  allPossibleMoves(player) {
    const posisbleMoves = [];

    for (let i = 0; i < this._maxRows; i++) {
      for (let j = 0; j < this._maxCols; j++) {
        if (!this.isCellEmpty(i, j)) {
          if (this.board[i][j].player === player) {
            let moves = this.board[i][j].validCells(this);
            moves.forEach((move) => {
              posisbleMoves.push({
                fromRow: i,
                fromCol: j,
                toRow: move.row,
                toCol: move.col,
              });
            });
          }
        }
      }
    }

    return posisbleMoves;
  }

  willKingBeInCheck(fromRow, fromCol, toRow, toCol, oppositionPlayer) {
    const tempBoard = this.clone();
    if(!tempBoard.isCellEmpty(toRow, toCol)) {
      tempBoard.board[toRow][toCol] = tempBoard.board[fromRow][fromCol];
      tempBoard.board[fromRow][fromCol] = null;

      const oppositionPossibleMoves = tempBoard.allPossibleMoves(oppositionPlayer);
      for (const oppositionMove of oppositionPossibleMoves) {
        if (toRow === oppositionMove.toRow && toCol === oppositionMove.toCol){
          return true;
        }
      }
      return false;
    }
    // const oppositionPossibleMoves = this.allPossibleMoves(oppositionPlayer);
    // for (const oppositionMove of oppositionPossibleMoves) {
    //   if (toRow === oppositionMove.toRow && toCol === oppositionMove.toCol) {
    //     return true;
    //   }
    // }
    return false;
  }

  setOppositionInCheckTrue(piece, oppositionPlayer) {
    // console.log(piece);
    const moves = piece.validCells(this);
    // console.log(moves);

    for (const move of moves) {
      if (!this.isCellEmpty(move.row, move.col)) {
        if (this.board[move.row][move.col].name === "king") {
          this.setCheckStatus(oppositionPlayer, true);
          this.reducePoints(this.board[move.row][move.col]);
        }
      }
    }
  }

  capturePiece(row, col, player) {
    if (!this.isCellEmpty(row, col)){
      // console.log(this.board[row][col]);
      if (this.board[row][col].player === player) {
        this.reducePoints(this.board[row][col]);
        
      }
    }
  }

  reducePoints(piece) {
    if (piece.player === "human") {
      this.humanPoints -= piece._points;
      this.aiPoints += 3*piece._points;
    } else {
      this.aiPoints -= piece._points;
      this.humanPoints += piece._points;
    }
  }

  restoreKingPoints(player) {
    if (player === "human") {
      this.humanPoints += 900;
    } else {
      this.aiPoints += 900;
    }
  }
  getCheckStatus(player) {
    if (player === "human") {
      return this.humanInCheck;
    } else {
      return this.aiInCheck;
    }
  }
  setCheckStatus(player, status) {
    if (player === "human") {
      this.humanInCheck = status;
    } else {
      this.aiInCheck = status;
    }
  }
  /**
   *
   * @param {number} fromRow
   * @param {number} fromCol
   * @param {number} toRow
   * @param {number} toCol
   */
  _movePiece(fromRow, fromCol, toRow, toCol, oppositionPlayer) {
    //reduce points if the piece can be captured.
    // console.log(oppositionPlayer);
    this.capturePiece(toRow, toCol, oppositionPlayer);

    // moving the piece in the board.
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;

    //changing the coordiantes of the moved piece.
    this.board[toRow][toCol].row = toRow;
    this.board[toRow][toCol].col = toCol;

    if (this.board[toRow][toCol]._firstMove) {
      this.board[toRow][toCol]._firstMove = false;
    }

    this.setOppositionInCheckTrue(this.board[toRow][toCol], oppositionPlayer);
  }
  /**
   *
   * @param {{row:number, col:number}} targetCell
   * @param {Array<{row:number, col: number}>} validCells
   * @returns true if the target cell is valid.
   */
  isMoveValid(targetCell, validCells) {
    for (const cell of validCells) {
      if (targetCell.row === cell.row && targetCell.col === cell.col) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {number} row
   * @param {number} col
   * @returns true if the (row, col) cell is in the board.
   *
   */
  isInBoard(row, col) {
    if (0 <= row && row < this._maxRows && 0 <= col && col < this._maxCols)
      return true;
    else return false;
  }
  /**
   *
   * @param {number} row
   * @param {number} col
   * @returns true if (row, col) is inside of the board.
   *
   */
  isCellEmpty(row, col) {
    if (this.board[row][col] === null) {
      return true;
    } else {
      return false;
    }
  }
  /**
   *
   * @param {number} row
   * @param {number} col
   * @param {string} player
   * @returns true if opposition piece in (row,col) cell
   * can be captured.
   */
  canCapture(row, col, player) {
    if (this.isCellEmpty(row, col)) {
      return false;
    }

    if (this.board[row][col].player != player) {
      return true;
    } else {
      return false;
    }
  }

  isCheck(row, col, player) {
    if (this.board[row][col].player != player) {
      if (this.board[row][col].name === "king") {
        return true;
      }
    }
    return false;
  }

  myKingIncheck(player) {
    let kingPos = null;

    for (let i = 0; i < this._maxRows; i++) {
      for (let j = 0; j < this._maxCols; j++) {
        const piece = this.board[i][j];
        if (piece) {
          if (piece.name === "king" && piece.player === player) {
            kingPos = { row: i, col: j };
            break;
          }
        }
      }
      if (kingPos) {
        break;
      }
    }

    const oppositionPossibleMoves = this.allPossibleMoves(
      this._getOppositionPlayer(player)
    );
    for (const move of oppositionPossibleMoves) {
      if (move.toRow === kingPos.row && move.toCol === kingPos.col) {
        // this.setCheckStatus(player, true);
        return true;
      }
    }

    // this.setCheckStatus(player, false);
    return false;
  }

  _getOppositionPlayer(player) {
    return player === "human" ? "ai" : "human";
  }

  getPlayerPoins(player) {
    if (player === "human") {
      return this.humanPoints;
    } else {
      return this.aiPoints;
    }
  }
  
  evaluatePoints(player) {
    let score = 0;

    for (let row = 0; row < this._maxRows; row++) {
      for (let col = 0; col < this._maxCols; col++){
        if (!this.isCellEmpty(row, col)) {
          const piece = this.board[row][col];
          if (piece.player === player) {
            score += this.piecePositionPoints(row, col);
            if (piece.name === "king") {
              score += this.kingPoints(row, col);
            } 
          }
        }
      }
    }

    return score + this.getPlayerPoins(player);
  }
  piecePositionPoints(row, col) {
    const centralizationPoints = this.isCentralized(row, col) ? 5 : 0;
    return centralizationPoints;
  }

  isCentralized(row, col) {
    if ((1 < row && row < 4) && (0 < col && col <4)) {
      return true;
    } else {
      return false;
    }
  }

  kingPoints(row, col) {
    if (this.isCentralized(row, col)) {
      return -5;
    } else {
      return 0;
    }
  }
}

class Piece {
  constructor(player, row, col) {
    this.player = player;
    this.row = row;
    this.col = col;
  }
  /**
   *
   * @param {Board} board
   * @returns an array of valid cell objects for the piece.
   */
  validCells(board) {
    return [];
  }

  // moveToCell()
}

class Pawn extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this._firstMove = true;
    this.name = "pawn";
    this._points = 10;
  }
  validCells(board) {
    const cells = [];
    const direction = this.player === "ai" ? -1 : 1;

    const newRow = this.row + direction;
    const newCol = this.col;

    // checks one move forward
    if (board.isInBoard(newRow, newCol) && board.isCellEmpty(newRow, newCol)) {
      cells.push({
        row: newRow,
        col: newCol,
      });
    }
    // the pawn can move 1 or 2 cells as it's first move
    if (this._firstMove) {
      const newRow2 = this.row + 2 * direction;

      if (
        board.isInBoard(newRow2, newCol) &&
        board.isCellEmpty(newRow2, newCol)
      ) {
        cells.push({
          row: newRow2,
          col: newCol,
        });
      }
    }
    // diagonal movment for capturing.
    const captureCols = [this.col - 1, this.col + 1];

    for (const col of captureCols) {
      const newRow = this.row + direction;

      if (
        board.isInBoard(newRow, col) &&
        board.canCapture(newRow, col, this.player)
      ) {
        cells.push({
          row: newRow,
          col: col,
        });
      }
    }

    return cells;
  }
  validMoves() {}
}

class Bishop extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this.name = "bishop";
    this._points = 30;
  }

  validCells(board) {
    const cells = [];

    // a bishop goes diagonally in 4 directions
    const directions = [
      { row: +1, col: +1 },
      { row: +1, col: -1 },
      { row: -1, col: +1 },
      { row: -1, col: -1 },
    ];

    // calculates cells for each of the 4 directions
    for (const direction of directions) {
      let newRow = this.row + direction.row;
      let newCol = this.col + direction.col;

      // keep going if there are empty cells, stop
      // at the first sight of a non-empty cell
      while (
        board.isInBoard(newRow, newCol) &&
        board.isCellEmpty(newRow, newCol)
      ) {
        cells.push({
          row: newRow,
          col: newCol,
        });
        newRow += direction.row;
        newCol += direction.col;
      }

      // if the first non-empty can be caputred,
      // add it to the list of valid cells
      if (
        board.isInBoard(newRow, newCol) &&
        board.canCapture(newRow, newCol, this.player)
      ) {
        cells.push({
          row: newRow,
          col: newCol,
        });
      }
    }
    return cells;
  }
}

class Knight extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this.name = "knight";
    this._points = 30;
  }

  validCells(board) {
    const cells = [];
    const possibleMoves = [
      { row: +1, col: +2 },
      { row: +1, col: -2 },
      { row: -1, col: +2 },
      { row: -1, col: -2 },
      { row: +2, col: +1 },
      { row: +2, col: -1 },
      { row: -2, col: +1 },
      { row: -2, col: -1 },
    ];

    // checks each of the 8 possible moves
    // knight moves to an empty or enemy cell.
    for (const move of possibleMoves) {
      const newRow = this.row + move.row;
      const newCol = this.col + move.col;

      if (
        board.isInBoard(newRow, newCol) &&
        (board.isCellEmpty(newRow, newCol) ||
          board.canCapture(newRow, newCol, this.player))
      ) {
        cells.push({
          row: newRow,
          col: newCol,
        });
      }
    }
    return cells;
  }
}

class Rook extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this.name = "rook";
    this._points = 50;
  }

  validCells(board) {
    const cells = [];
    const directions = [
      { row: -1, col: 0 },
      { row: +1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: +1 },
    ];

    for (const direction of directions) {
      let newRow = this.row + direction.row;
      let newCol = this.col + direction.col;

      // move forward in the selected direction
      while (board.isInBoard(newRow, newCol)) {
        if (board.isCellEmpty(newRow, newCol)) {
          cells.push({
            row: newRow,
            col: newCol,
          });
        }
        // add to valid cells if a capture cell appears.
        // stop after the first non empty cell
        else if (board.canCapture(newRow, newCol, this.player)) {
          cells.push({
            row: newRow,
            col: newCol,
          });
          break;
        }
        // stop at the first non-empty cell
        else {
          break;
        }

        newRow += direction.row;
        newCol += direction.col;
      }
    }

    return cells;
  }
}

class Queen extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this.name = "queen";
    this._points = 90;
  }

  validCells(board) {
    const cells = [];

    const directions = [
      { row: -1, col: 0 },
      { row: +1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: +1 },
      { row: -1, col: -1 },
      { row: -1, col: +1 },
      { row: +1, col: -1 },
      { row: +1, col: +1 },
    ];

    for (const direction of directions) {
      let newRow = this.row + direction.row;
      let newCol = this.col + direction.col;

      while (board.isInBoard(newRow, newCol)) {
        if (board.isCellEmpty(newRow, newCol)) {
          cells.push({
            row: newRow,
            col: newCol,
          });
        } else if (board.canCapture(newRow, newCol, this.player)) {
          cells.push({
            row: newRow,
            col: newCol,
          });
          break;
        } else {
          break;
        }

        newRow += direction.row;
        newCol += direction.col;
      }
    }

    return cells;
  }
}

class King extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this.name = "king";
    this._points = 900;
  }

  validCells(board) {
    const cells = [];

    const directions = [
      { row: -1, col: -1 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];

    for (const direction of directions) {
      const newRow = this.row + direction.row;
      const newCol = this.col + direction.col;

      if (
        board.isInBoard(newRow, newCol) &&
        (board.isCellEmpty(newRow, newCol) ||
          board.canCapture(newRow, newCol, this.player))
      ) {
        cells.push({
          row: newRow,
          col: newCol,
        });
      }
    }

    return cells;
  }
}
