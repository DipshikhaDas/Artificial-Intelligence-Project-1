class Board {
  constructor(rows, cols) {
    this._maxRows = rows;
    this._maxCols = cols;
    this.board = [];

    for (let i = 0; i < rows; i++) {
      this.board.push([]);
      for (let j = 0; j < cols; j++) {
        this.board[i].push(null);
      }
    }
  }

  /**
   * 
   * @param {Piece} piece 
   * @param {number} row 
   * @param {number} col
   *  
   */
  addPiece(piece, row, col) {
    if (this.isInBoard(row, col)) {
      this.board[row][col] = piece;
    }
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

  isCellEmpty(row, col) {
    if (this.board[row][col] === null) {
      return true;
    } else {
      return false;
    }
  }

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

  isMyPieceThereAlready(row, col, player) {
    if (this.board[row][col].player === player) {
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
}

class Pawn extends Piece {
  constructor(player, row, col) {
    super(player, row, col);
    this._firstMove = true;
    this.name = "pawn";
  }
  validCells(board) {
    const cells = [];
    const direction = this.player === "human" ? -1 : 1;

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
