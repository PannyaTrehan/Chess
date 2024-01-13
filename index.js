const squares = document.querySelectorAll(".square");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 8}, () => Array(8).fill(''));
let currentPlayer = "White";
let running = false;

initialiseGame();

function initialiseGame() {
    squares.forEach (square => {
        square.addEventListener("click", squareClicked);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    setInitialBoard();
    running = true;
}

function setInitialBoard() {
    let pieces = [
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];

    for (let row = 0; row < 2; row++) {
        for (let column = 0; column < 8; column++) {
            const squareToUpdate = document.querySelector(`[squareIndex="${row * 8 + column}"]`);
            if (row === 0) {
                board[row][column] = (pieces[1][column] + "b");
                squareToUpdate.textContent = (pieces[1][column] + "b");
            } else {
                board[row][column] = (pieces[0][column] + "b");
                squareToUpdate.textContent = (pieces[0][column] + "b");
            }
        }
    }

    for (let row = 6; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const squareToUpdate = document.querySelector(`[squareIndex="${row * 8 + column}"]`);
            board[row][column] = (pieces[row - 6][column] + "w");
            squareToUpdate.textContent = (pieces[row - 6][column] + "w");
        }
    }
}

function squareClicked() {
    const squareIndex = this.getAttribute("squareIndex");
    let row = Math.floor(squareIndex / 8);
    let column = squareIndex - (row * 8);

    switch(board[row][column].charAt(0)) {
        case "P":
            pawn(row, column);
            break;
        case "B":
            bishop(row, column);
            break;
        case "N":
            knight(row, column);
            break;
        case "R":
            rook(row, column);
            break;
        case "Q":
            queen(row, column);
            break;
        case "K":
            king(row, column);
            break;
        default:
    }

    console.log(board[row][column].charAt(0));
}

function updateSquare(row, column, input) { //will not modify the board array
    const squareToUpdate = document.querySelector(`[squareIndex="${toIndex(row, column)}"]`);
    squareToUpdate.textContent = input;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "White") ? "Black" : "White";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
    console.clear();
    currentPlayer = "White";
    board = Array.from({ length: 8}, () => Array(8).fill(''));
    statusText.textContent = `${currentPlayer}'s turn`;

    squares.forEach(square => {
        square.textContent = "";
        square.classList.remove("hovered-cell");
    });
    setInitialBoard();
    running = true;
}

function toIndex(row, column) {
    return row * 8 + column;
}

function placePossibleMove(possibleMoves) {
    for (let i = 0; i < possibleMoves.length; i++) {
        const row = possibleMoves[i][0];
        const column = possibleMoves[i][1];
        if (board[row][column] === "") {
            updateSquare(row, column, "*");
            board[row][column] = "*";
        } else {
            updateSquare(row, column, ("(" + board[row][column] + ")"));
            board[row][column] = "(" + board[row][column] + ")";
        }
    }
}

function isValidMove(row, column) {
    return row >= 0 && row < board.length && column >= 0 && column < board[0].length && board[row][column].charAt(1) != currentPlayer.charAt(0).toLowerCase();
}

function pawn(row, column) {
    const whiteMovements = [
        [-1, 0], //one step forward
        [-2, 0], //two steps forward
        [-1, 1], //one step forward and one step to the right
        [-1, -1] //one step forward and one step to the left
    ]

    const blackMovements = [
        [1, 0], //one step forward
        [2, 0], //two steps forward
        [1, 1], //one step forward and one step to the right
        [1, -1] //one step forward and one step to the left
    ]

    let possibleMoves = []; //vector to store movements
    if (currentPlayer === "White") {
        for (let i = 0; i < whiteMovements.length; i++) {
            console.log("Wjote");
            const newRow = row + whiteMovements[i][0];
            const newColumn = column + whiteMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow+1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    } else if (currentPlayer === "Black") {
        for (let i = 0; i < blackMovements.length; i++) {
            const newRow = row + blackMovements[i][0];
            const newColumn = column + blackMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow-1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    }

    placePossibleMove(possibleMoves);
}

function bishop(row, column) {

}

function knight(row, column) {

}

function rook(row, column) {

}

function queen(row, column) {

}

function king(row, column) {

}