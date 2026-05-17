// src/pieces/Queen.js
import Piece from './Piece.js';

export default class Queen extends Piece {
  constructor(color, symbol) {
    super(color, symbol);
  }

  isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
    if (fromRow === toRow && fromCol === toCol) return false; // Guard Clause

    const isStraight = fromRow === toRow || fromCol === toCol;
    const isDiagonal = Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);

    if (!isStraight && !isDiagonal) return false;

    const rowDir = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colDir = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);

    let currRow = fromRow + rowDir;
    let currCol = fromCol + colDir;

    while (currRow !== toRow || currCol !== toCol) {
      if (boardGrid[currRow][currCol] !== '.') {
        return false;
      }
      currRow += rowDir;
      currCol += colDir;
    }
    const targetCell = boardGrid[toRow][toCol];
    return targetCell === '.' || targetCell.color !== this.color;
  }
}