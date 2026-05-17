// src/pieces/King.js
import Piece from './Piece.js';

export default class King extends Piece {
    constructor(color, symbol) {
        super(color, symbol);
    }

    isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
        if (fromRow === toRow && fromCol === toCol) return false;

        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);

        // Gerakan Normal Raja (1 Kotak)
        if (rowDiff <= 1 && colDiff <= 1) {
            const targetCell = boardGrid[toRow][toCol];
            return targetCell === '.' || targetCell.color !== this.color;
        }

        // Gerakan Rokade (2 Kotak Horizontal)
        if (!this.hasMoved && rowDiff === 0 && colDiff === 2) {
            // Rokade Pendek
            if (toCol === 6) {
                const rook = boardGrid[fromRow][7];
                if (rook !== '.' && rook.constructor.name === 'Rook' && !rook.hasMoved) {
                    if (boardGrid[fromRow][5] === '.' && boardGrid[fromRow][6] === '.') {
                        return true;
                    }
                }
            }
            // Rokade Panjang
            else if (toCol === 2) {
                const rook = boardGrid[fromRow][0];
                if (rook !== '.' && rook.constructor.name === 'Rook' && !rook.hasMoved) {
                    if (boardGrid[fromRow][1] === '.' && boardGrid[fromRow][2] === '.' && boardGrid[fromRow][3] === '.') {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}