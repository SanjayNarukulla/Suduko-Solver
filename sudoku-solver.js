// Function to create the 9x9 Sudoku grid
function createSudokuGrid() {
    const gridContainer = document.getElementById('sudoku-grid');
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'text');
            inputElement.setAttribute('maxlength', '1'); // Allows only one digit per input
            inputElement.setAttribute('id', `cell-${row}-${col}`); // Unique ID for each cell
            inputElement.classList.add('sudoku-cell'); // Adding CSS class for styling
            
            // Restrict input to digits 1-9
            inputElement.addEventListener('input', (e) => {
                const value = e.target.value;
                if (!/^[1-9]$/.test(value)) {
                    e.target.value = '';
                }
            });
            
            gridContainer.appendChild(inputElement);
        }
    }
}


// Function to reset the Sudoku grid
function resetSudokuGrid() {
    const inputs = document.querySelectorAll('.sudoku-cell');
    inputs.forEach(input => input.value = ''); // Clear each input field
}

// Call the function to create the grid when the page loads
createSudokuGrid();

// Function to extract the board state from the inputs
function getBoardState() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const currentRow = [];
        for (let col = 0; col < 9; col++) {
            const cellValue = document.getElementById(`cell-${row}-${col}`).value;
            currentRow.push(cellValue ? parseInt(cellValue) : null);
        }
        board.push(currentRow);
    }
    return board;
}

// Function to update the grid with the solved board
function updateBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            document.getElementById(`cell-${row}-${col}`).value = board[row][col] || '';
        }
    }
}

// Sudoku solver functions
function solveSudoku() {
    const board = getBoardState();
    if (validBoard(board)) {
        const solvedBoard = solve(board);
        if (solvedBoard) {
            updateBoard(solvedBoard);
        } else {
            alert("No solution exists for the given Sudoku board.");
        }
    } else {
        alert("The given Sudoku board is invalid.");
    }
}

function solve(board) {
    if (solved(board)) {
        return board;
    } else {
        const possibilities = nextBoards(board);
        const validBoards = keepOnlyValid(possibilities);
        return searchForSolution(validBoards);
    }
}

function searchForSolution(boards) {
    if (boards.length < 1) {
        return false;
    } else {
        const first = boards.shift();
        const tryPath = solve(first);
        if (tryPath) {
            return tryPath;
        } else {
            return searchForSolution(boards);
        }
    }
}

function solved(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == null) {
                return false;
            }
        }
    }
    return true;
}

function nextBoards(board) {
    const res = [];
    const firstEmpty = findEmptySquare(board);
    if (firstEmpty) {
        const y = firstEmpty[0];
        const x = firstEmpty[1];
        for (let i = 1; i <= 9; i++) {
            const newBoard = board.map(arr => arr.slice());
            newBoard[y][x] = i;
            res.push(newBoard);
        }
    }
    return res;
}

function findEmptySquare(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == null) {
                return [i, j];
            }
        }
    }
}

function keepOnlyValid(boards) {
    return boards.filter(board => validBoard(board));
}

function validBoard(board) {
    return rowsGood(board) && columnsGood(board) && boxesGood(board);
}

function rowsGood(board) {
    for (let row of board) {
        if (!unitsGood(row)) return false;
    }
    return true;
}

function columnsGood(board) {
    for (let col = 0; col < 9; col++) {
        const column = [];
        for (let row = 0; row < 9; row++) {
            column.push(board[row][col]);
        }
        if (!unitsGood(column)) return false;
    }
    return true;
}

function boxesGood(board) {
    const boxCoordinates = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2],
    ];
    
    for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
            const box = [];
            for (let [dy, dx] of boxCoordinates) {
                box.push(board[y + dy][x + dx]);
            }
            if (!unitsGood(box)) return false;
        }
    }
    return true;
}

function unitsGood(unit) {
    const seen = [];
    for (let num of unit) {
        if (num !== null) {
            if (seen.includes(num)) {
                return false;
            }
            seen.push(num);
        }
    }
    return true;
}
