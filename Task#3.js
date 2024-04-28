const crypto = require('crypto');

class KeyGenerator {
    static generateKey() {
        return crypto.randomBytes(32); // 256 bits
    }
}

class HMACCalculator {
    static calculateHMAC(key, message) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(message);
        return hmac.digest('hex');
    }
}

class GameRules {
    static determineWinner(playerMove, computerMove, moves) {
        const n = moves.length;
        const half = Math.floor(n / 2);
        const indexOfPlayerMove = moves.indexOf(playerMove);
        const indexOfComputerMove = moves.indexOf(computerMove);

        if (indexOfPlayerMove === indexOfComputerMove) {
            return "Draw";
        } else if ((indexOfPlayerMove + half) % n === indexOfComputerMove) {
            return "You win";
        } else {
            return "Computer wins";
        }
    }
}


class ASCIITableGenerator {
    static generateTable(moves) {
        const n = moves.length;
        const table = new Array(n + 1).fill(null).map(() => new Array(n + 1).fill(null));

        // Set column headers
        for (let i = 1; i <= n; i++) {
            table[0][i] = moves[i - 1];
        }

        // Set row headers and cell values
        for (let i = 1; i <= n; i++) {
            table[i][0] = moves[i - 1];
            for (let j = 1; j <= n; j++) {
                if (i === j) {
                    table[i][j] = "Draw";
                } else {
                    const diff = (j - i + n) % n;
                    if (diff <= Math.floor(n / 2)) {
                        table[i][j] = "Win";
                    } else {
                        table[i][j] = "Lose";
                    }
                }
            }
        }

        // Convert table to ASCII format
        const maxLength = Math.max(...moves.map(move => move.length)) + 2; // Calculate maximum length
         // Pad each cell
        return table.map(row => row.map(cell => (cell === null ? '\t' : cell.padEnd(maxLength))).join('')).join('\n');
    }
}

// Parse command line arguments
const moves = process.argv.slice(2);
if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error("Incorrect input. Please provide an odd number of non-repeating moves.");
    console.error("Example: node game.js rock paper scissors");
    process.exit(1);
}

const key = KeyGenerator.generateKey();
const computerMove = moves[Math.floor(Math.random() * moves.length)];

console.log("HMAC:", HMACCalculator.calculateHMAC(key, computerMove));
console.log("Available moves:");
moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
console.log("0 - Exit");
console.log("? - Help");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("Enter your move: ", (input) => {
    const choice = input;

    if (parseInt(choice) === 0) {
        console.log("Exiting the game...");
        readline.close();
        return;
    } else if (choice === '?') {
        console.log("ASCII Table:");
        console.log(ASCIITableGenerator.generateTable(moves));
        readline.close();
        return;
    }

    else if (isNaN(parseInt(choice)) || choice < 0 || choice > moves.length) {
        console.error("Invalid input. Please enter a valid move number.");
        readline.close();
        return;
    }

    const playerMove = moves[choice - 1];
    const result = GameRules.determineWinner(playerMove, computerMove, moves);
    console.log(`Your move: ${playerMove}`);
    console.log(`Computer move: ${computerMove}`);
    console.log(result + "!");
    console.log("HMAC key:", key.toString('hex'));

    readline.close();
});