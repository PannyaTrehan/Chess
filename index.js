const squares = document.querySelectorAll(".square");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 8}, () => Array(8).fill(''));
let currentPlayer = "White";
let running = false;
let isSecondClick = false;
let currentPiece = "";
let previousPieceRow = -1;
let previousPieceColumn = -1;
//create two arrays, each for the pieces that were taken from the other player  (white and black)

initialiseGame();

function initialiseGame() {
    squares.forEach (square => {
        square.addEventListener("click", clickManagement);
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
                updateSquare(row, column, board[row][column]);
                //squareToUpdate.textContent = (pieces[1][column] + "b");
            } else {
                board[row][column] = (pieces[0][column] + "b");
                updateSquare(row, column, board[row][column]);
                //squareToUpdate.textContent = (pieces[0][column] + "b");
            }
        }
    }

    for (let row = 6; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const squareToUpdate = document.querySelector(`[squareIndex="${row * 8 + column}"]`);
            board[row][column] = (pieces[row - 6][column] + "w");
            updateSquare(row, column, board[row][column]);
            //squareToUpdate.textContent = (pieces[row - 6][column] + "w");
        }
    }
}

function clickManagement() {
    console.log(board[3][4]);
    if (!isSecondClick) {
        clearStarAndBracket();
        const squareIndex = this.getAttribute("squareIndex");
        previousPieceRow = Math.floor(squareIndex / 8);
        previousPieceColumn = squareIndex - (previousPieceRow * 8);
        if (board[previousPieceRow][previousPieceColumn].charAt(1) === currentPlayer.charAt(0).toLowerCase()) {
            squareClicked(squareIndex);
            isSecondClick = true;
        }
    } else {
        const squareIndex = this.getAttribute("squareIndex");

        const row = Math.floor(squareIndex / 8);
        const column = squareIndex - (row * 8);

        if (board[row][column].charAt(0) === "*" || board[row][column].charAt(0) === "(") {

            board[row][column] = currentPiece;
            updateSquare(row, column, currentPiece);

            board[previousPieceRow][previousPieceColumn] = "";
            updateSquare(previousPieceRow, previousPieceColumn, "");
            
            currentPiece = "";
            changePlayer();
            clearStarAndBracket();
            previousPieceRow = -1;
            previousPieceColumn = -1;
            isSecondClick = false;
        } else if (board[row][column].charAt(1) != currentPlayer.charAt(0).toLowerCase() || board[row][column] === "") { //clicked on opponents piece
            isSecondClick = !isSecondClick;
            clearStarAndBracket();
        } else {
            clearStarAndBracket();
            squareClicked(squareIndex);
            previousPieceRow = Math.floor(squareIndex / 8);
            previousPieceColumn = squareIndex - (previousPieceRow * 8);
        }
    }
}

function clearStarAndBracket() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (board[row][column] === "*") {
                board[row][column] = "";
                updateSquare(row, column, "");
            } else if (board[row][column].charAt(0) === "(" && board[row][column].length > 2) {
                board[row][column] = board[row][column].replace(/[()]/g, '');
                updateSquare(row, column, board[row][column]);
            }
        }
    }
}

function squareClicked(squareIndex) {
    let row = Math.floor(squareIndex / 8); //1
    let column = squareIndex - (row * 8); //13 - 8 = 5

    currentPiece = board[row][column];

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
            currentPiece = "";
    }
}

function updateSquare(row, column, input) { //will not modify the board array

    const squareToUpdate = document.querySelector(`[squareIndex="${toIndex(row, column)}"]`);

    squareToUpdate.innerHTML = "";
    
    // Clear the square's content before adding new content
    const imageElement = document.createElement("img");
    imageElement.src = getImagePath(input);

    // if (input.includes("Pb")  || input.includes("Pw")) {
    //     imageElement.classList.add("pawn");
    // } else if (!(input.includes("R") || input.includes("N"))) {
    //     imageElement.classList.add("other");
    // }

    if (input.includes("(")) {
        imageElement.classList.add("attacked");
    }

    squareToUpdate.appendChild(imageElement);
}

function getImagePath(piece) {
    if (piece.includes("*")) {
        return "Pieces/Blank/dot.png";
    } else if (piece.includes("Pb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/pawn.png";
        }
        return "Pieces/Black/pawn.png";
    } else if (piece.includes("Rb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/rook.png";
        }
        return "Pieces/Black/rook.png";
    } else if (piece.includes("Kb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/king.png";
        }
        return "Pieces/Black/king.png";
    } else if (piece.includes("Qb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/queen.png";
        }
        return "Pieces/Black/queen.png";
    } else if (piece.includes("Bb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/bishop.png";
        }
        return "Pieces/Black/bishop.png";
    } else if (piece.includes("Nb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/knight.png";
        }
        return "Pieces/Black/knight.png";
    } else if (piece.includes("Pw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/pawn.png";
        }
        return "Pieces/White/pawn.png";
    } else if (piece.includes("Rw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/rook.png";
        }
        return "Pieces/White/rook.png";
    } else if (piece.includes("Kw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/king.png";
        }
        return "Pieces/White/king.png";
    } else if (piece.includes("Qw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/queen.png";
        }
        return "Pieces/White/queen.png";
    } else if (piece.includes("Bw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/bishop.png";
        }
        return "Pieces/White/bishop.png";
    } else if (piece.includes("Nw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/knight.png";
        }
        return "Pieces/White/knight.png";
    } else {
        return "";
    }
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
            const newRow = row + whiteMovements[i][0];
            const newColumn = column + whiteMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow+1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn) && newRow === 4) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn) && board[newRow][newColumn] != "") {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    } else if (currentPlayer === "Black") {
        for (let i = 0; i < blackMovements.length; i++) {
            const newRow = row + blackMovements[i][0];
            const newColumn = column + blackMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow-1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn) && newRow === 3) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn) && board[newRow][newColumn] != "") {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    }

    placePossibleMove(possibleMoves);
}

function bishop(row, column) {
    let possibleMoves = [];
    //top right diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column + i)) {
            possibleMoves.push([row - i, column + i]);
            if (checkOpponentPiece(row - i, column + i)) {
                break;
            }
        } else {
            break;
        }
    }
    //top left diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column - i)) {
            possibleMoves.push([row - i, column - i]);
            if (checkOpponentPiece(row - i, column - i)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column + i)) {
            possibleMoves.push([row + i, column + i]);
            if (checkOpponentPiece(row + i, column + i)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column - i)) {
            possibleMoves.push([row + i, column - i]);
            if (checkOpponentPiece(row + i, column - i)) {
                break;
            }
        } else {
            break;
        }
    }

    placePossibleMove(possibleMoves);

}

function knight(row, column) {
    const movements = [
        [-2, 1],
        [-2, -1],
        [2, 1],
        [2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
    ];

    let possibleMoves = [];

    for (let i = 0; i < movements.length; i++) {
        if (isValidMove(row + movements[i][0], column + movements[i][1])) {
            possibleMoves.push([row + movements[i][0], column + movements[i][1]]);
        }
    }

    placePossibleMove(possibleMoves);

}

function checkOpponentPiece(row, column) {
    if (currentPlayer === "White") {
        if (board[row][column].includes("b")) {
            return true;
        }
    } else {
        if (board[row][column].includes("w")) {
            return true;
        }
    }

    return false;
}

function rook(row, column) {
    let possibleMoves = [];
    
    for (let rowIncrease = row + 1; rowIncrease < 8; rowIncrease++) {
        if (isValidMove(rowIncrease, column)) {
            possibleMoves.push([rowIncrease, column]);
            if (checkOpponentPiece(rowIncrease, column)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let rowDecrease = row - 1; rowDecrease >= 0; rowDecrease--) {
        if (isValidMove(rowDecrease, column)) {
            possibleMoves.push([rowDecrease, column]);
            if (checkOpponentPiece(rowDecrease, column)) {
                break;
            }
        } else {
            console.log("reached");
            break;
        }
    }

    for (let columnIncrease = column + 1; columnIncrease < 8; columnIncrease++) {
        if (isValidMove(row, columnIncrease)) {
            possibleMoves.push([row, columnIncrease]);
            if (checkOpponentPiece(row, columnIncrease)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnDecrease = column - 1; columnDecrease >= 0; columnDecrease--) {
        if (isValidMove(row, columnDecrease)) {
            possibleMoves.push([row, columnDecrease]);
            if (checkOpponentPiece(row, columnDecrease)) {
                break;
            }
        } else {
            break;
        }
    }

    placePossibleMove(possibleMoves);
}

function queen(row, column) {
    let possibleMoves = [];

    for (let rowIncrease = row + 1; rowIncrease < 8; rowIncrease++) {
        if (isValidMove(rowIncrease, column)) {
            possibleMoves.push([rowIncrease, column]);
            if (checkOpponentPiece(rowIncrease, column)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let rowDecrease = row - 1; rowDecrease >= 0; rowDecrease--) {
        if (isValidMove(rowDecrease, column)) {
            possibleMoves.push([rowDecrease, column]);
            if (checkOpponentPiece(rowDecrease, column)) {
                break;
            }
        } else {
            console.log("reached");
            break;
        }
    }

    for (let columnIncrease = column + 1; columnIncrease < 8; columnIncrease++) {
        if (isValidMove(row, columnIncrease)) {
            possibleMoves.push([row, columnIncrease]);
            if (checkOpponentPiece(row, columnIncrease)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnDecrease = column - 1; columnDecrease >= 0; columnDecrease--) {
        if (isValidMove(row, columnDecrease)) {
            possibleMoves.push([row, columnDecrease]);
            if (checkOpponentPiece(row, columnDecrease)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column + i)) {
            possibleMoves.push([row - i, column + i]);
            if (checkOpponentPiece(row - i, column + i)) {
                break;
            }
        } else {
            break;
        }
    }
    //top left diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column - i)) {
            possibleMoves.push([row - i, column - i]);
            if (checkOpponentPiece(row - i, column - i)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column + i)) {
            possibleMoves.push([row + i, column + i]);
            if (checkOpponentPiece(row + i, column + i)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column - i)) {
            possibleMoves.push([row + i, column - i]);
            if (checkOpponentPiece(row + i, column - i)) {
                break;
            }
        } else {
            break;
        }
    }

    placePossibleMove(possibleMoves);

}

function king(row, column) {
    let possibleMoves = [];

    const movements = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
    ];

    for (let i = 0; i < movements.length; i++) {
        if (isValidMove(row + movements[i][0], column + movements[i][1])) {
            possibleMoves.push([row + movements[i][0], column + movements[i][1]]);
        }
    }

    placePossibleMove(possibleMoves);
}

function isCheck() {
    //try combining this with the isValid function (into 1)

    //this function checks if the board location for where the king will move to will be a check
    //to check this simply look at all the possible movements for the opposing players pieces
        //if there is a possible movement that attacks the piece of where the king could move to then it is not allowed
        //similarly this check should apply for all pieces
}