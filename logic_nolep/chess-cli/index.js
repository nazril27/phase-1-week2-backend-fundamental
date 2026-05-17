// index.js
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import Board from './src/Board.js';

import Queen from './src/pieces/Queen.js';
import Rook from './src/pieces/Rook.js';
import Bishop from './src/pieces/Bishop.js';
import Knight from './src/pieces/Knight.js';

function parseCommand(command) {
    const parts = command.toLowerCase().split(' ');
    if (parts.length !== 2) return null;

    const from = parts[0];
    const to = parts[1];
    const cols = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };

    if (from.length !== 2 || to.length !== 2) return null;

    const fromCol = cols[from[0]];
    const fromRow = 8 - parseInt(from[1]);
    const toCol = cols[to[0]];
    const toRow = 8 - parseInt(to[1]);

    if ([fromCol, fromRow, toCol, toRow].some(val => val === undefined || isNaN(val) || val < 0 || val > 7)) {
        return null;
    }

    return { fromRow, fromCol, toRow, toCol };
}

async function startGame() {
    const gameBoard = new Board();
    const rl = readline.createInterface({ input, output });
    let isWhiteTurn = true;

    while (true) {
        gameBoard.render();
        const currentPlayer = isWhiteTurn ? 'Putih' : 'Hitam';
        const currentPlayerColor = isWhiteTurn ? 'white' : 'black';
        const enemyColor = isWhiteTurn ? 'black' : 'white';

        if (gameBoard.isCheckMate(currentPlayerColor)) {
            console.log(`\n[SKAKMAT!] Raja ${currentPlayer} tidak bisa berkutik.`);
            const winner = isWhiteTurn ? "Hitam" : "Putih";
            console.log(`🏆 Selamat! Pemain ${winner} memenangkan permainan!`);
            break;
        }

        const answer = await rl.question(`Giliran ${currentPlayer}. Masukan perintah (contoh: e2 e4) atau ketik 'exit': `);

        if (answer.toLowerCase() === 'exit') {
            console.log('Permainan dihentikan.');
            break;
        }

        const moveData = parseCommand(answer);

        if (!moveData) {
            console.log('\n[Error] Format tidak valid! Gunakan format seperti "e2 e4".');
            await rl.question('Tekan Enter untuk mencoba lagi...');
            continue;
        }
        
        const pieceToMove = gameBoard.grid[moveData.fromRow][moveData.fromCol];

        if (pieceToMove === '.') {
            console.log('\n[Error] Tidak ada bidak di posisi tersebut!');
            await rl.question('Tekan Enter untuk mencoba lagi...');
            continue;
        }

        if (pieceToMove.color !== currentPlayerColor) {
            console.log(`\n[Error] Itu bukan bidakmu! Sekarang giliran ${currentPlayer}.`);
            await rl.question('Tekan Enter untuk mencoba lagi...');
            continue;
        }

        const isValid = pieceToMove.isValidMove(
            moveData.fromRow, moveData.fromCol,
            moveData.toRow, moveData.toCol,
            gameBoard.grid
        );

        if (!isValid) {
            console.log('\n[Error] Gerakan ilegal untuk bidak tersebut!');
            await rl.question('Tekan Enter untuk mencoba lagi...');
            continue;
        }

        const isCastling = pieceToMove.constructor.name === 'King' && Math.abs(moveData.fromCol - moveData.toCol) === 2;

        if (isCastling) {
            if (gameBoard.isCheck(currentPlayerColor)) {
                console.log("\n[Error] Ilegal! Tidak bisa Rokade saat sedang di-Skak.");
                await rl.question("Tekan Enter untuk mencoba lagi...");
                continue;
            }

            const midCol = (moveData.fromCol + moveData.toCol) / 2;
            
            gameBoard.grid[moveData.fromRow][midCol] = pieceToMove;
            gameBoard.grid[moveData.fromRow][moveData.fromCol] = '.';
            
            const isMidSquareAttacked = gameBoard.isCheck(currentPlayerColor);
            
            gameBoard.grid[moveData.fromRow][moveData.fromCol] = pieceToMove;
            gameBoard.grid[moveData.fromRow][midCol] = '.';

            if (isMidSquareAttacked) {
                console.log("\n[Error] Ilegal! Raja tidak boleh melewati kotak yang sedang diserang saat Rokade.");
                await rl.question("Tekan Enter untuk mencoba lagi...");
                continue;
            }
        }

        const targetCellBackup = gameBoard.grid[moveData.toRow][moveData.toCol];

        gameBoard.grid[moveData.toRow][moveData.toCol] = pieceToMove;
        gameBoard.grid[moveData.fromRow][moveData.fromCol] = '.';

        const isKingInDanger = gameBoard.isCheck(currentPlayerColor);

        gameBoard.grid[moveData.fromRow][moveData.fromCol] = pieceToMove;
        gameBoard.grid[moveData.toRow][moveData.toCol] = targetCellBackup;

        if (isKingInDanger) {
            console.log("\n[Error] Ilegal! Gerakan ini akan membuat Rajamu terkena Skak.");
            await rl.question("Tekan Enter untuk mencoba lagi...");
            continue;
        }

        gameBoard.movePiece(moveData.fromRow, moveData.fromCol, moveData.toRow, moveData.toCol);

        const movedPiece = gameBoard.grid[moveData.toRow][moveData.toCol];

        if (movedPiece.constructor.name === 'Pawn') {
            const isWhitePromoting = movedPiece.color === 'white' && moveData.toRow === 0;
            const isBlackPromoting = movedPiece.color === 'black' && moveData.toRow === 7;

            if (isWhitePromoting || isBlackPromoting) {
                gameBoard.render();
                let validPromotion = false;
                
                while (!validPromotion) {
                    const promoInput = await rl.question(`\n[Promosi Pion!] Pilih bidak baru untuk pionmu (Q = Ratu, R = Benteng, B = Gajah, N = Kuda): `);
                    const choice = promoInput.toUpperCase();
                    const color = movedPiece.color;
                    let newPiece = null;

                    switch(choice) {
                        case 'Q': newPiece = new Queen(color, '♛'); break;
                        case 'R': newPiece = new Rook(color, '♜'); break;
                        case 'B': newPiece = new Bishop(color, '♝'); break;
                        case 'N': newPiece = new Knight(color, '♞'); break;
                        default:
                            console.log("Input tidak valid! Harap ketik Q, R, B, atau N.");
                    }

                    if (newPiece) {
                        gameBoard.grid[moveData.toRow][moveData.toCol] = newPiece;
                        validPromotion = true;
                    }
                }
            }
        }
        
        if (gameBoard.isCheck(enemyColor)) {
            gameBoard.render();
            console.log(`\n[WARNING] SKAK! Raja ${enemyColor} dalam bahaya!`);
            await rl.question("Tekan Enter untuk melanjutkan...");
        }
       
        isWhiteTurn = !isWhiteTurn;
    }
    rl.close();
}

startGame();