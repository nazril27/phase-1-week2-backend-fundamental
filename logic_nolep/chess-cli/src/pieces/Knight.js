// src/pieces/Knight.js
import Piece from './Piece.js';

export default class Knight extends Piece {
  constructor(color, symbol) {
    super(color, symbol);
  }

  isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
    if (fromRow === toRow && fromCol === toCol) return false; // Guard Clause

    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      const targetCell = boardGrid[toRow][toCol];

      if (targetCell === '.' || targetCell.color !== this.color) {
        return true;
      }
    }

    return false;
  }
}