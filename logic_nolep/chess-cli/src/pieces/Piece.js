// src/pieces/Piece.js

export default class Piece {
    constructor(color, symbol) {
        this.color = color;
        this.symbol = symbol;
        this.hasMoved = false;
    }

    isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
        return true;
    }
}