// src/pieces/Pawn.js
import Piece from './Piece.js';

export default class Pawn extends Piece {
    constructor(color, symbol) {
        super(color, symbol);
    }

    isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
        if (fromRow === toRow && fromCol === toCol) return false;

        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Maju 1 langkah
        if (fromCol === toCol && toRow === fromRow + direction) {
            return boardGrid[toRow][toCol] === '.';
        }

        // Maju 2 langkah dari posisi awal
        if (fromCol === toCol && fromRow === startRow && toRow === fromRow + (direction * 2)) {
            const isDestinationEmpty = boardGrid[toRow][toCol] === '.';
            const isPathClear = boardGrid[fromRow + direction][fromCol] === '.';
            return isDestinationEmpty && isPathClear;
        }

        // Makan menyilang (diagonal 1 kotak)
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
            const targetCell = boardGrid[toRow][toCol];
            if (targetCell !== '.' && targetCell.color !== this.color) {
                return true;
            }
        }

        return false;
    }
}