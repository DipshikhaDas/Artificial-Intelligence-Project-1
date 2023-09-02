class Board {
  constructor(rows, cols) {
    this._maxRows = rows;
    this._maxCols = cols;
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
  }
  validCells(board) {
    const cells = [];
    const direction = this.player === "human" ? -1 : 1;

    if (this._firstMove) {
      for (let i = 1; i <= 2; i++) {
        const newRow = this.row + i * direction;
        const newCol = this.col;

        if (board.isInBoard(newRow, newCol)) {
          cells.push({
            row: newRow,
            col: newCol,
          });
        }
      }
    }
    return cells;
  }
  validMoves() {}
}
