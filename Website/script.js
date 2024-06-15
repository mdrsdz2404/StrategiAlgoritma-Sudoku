document.addEventListener("DOMContentLoaded", () => {
    const grid = Array.from(document.querySelectorAll("#grid input"));
    const status = document.getElementById("status");

    function getGrid() {
        return grid.map(cell => parseInt(cell.value) || 0);
    }

    function setGrid(values) {
        grid.forEach((cell, index) => {
            cell.value = values[index] || "";
        });
    }

    function isSafe(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row * 9 + x] === num || board[x * 9 + col] === num) return false;
        }

        const startRow = row - row % 3, startCol = col - col % 3;
        for (let r = 0; r < 3; r++) {
            for (let d = 0; d < 3; d++) {
                if (board[(startRow + r) * 9 + startCol + d] === num) return false;
            }
        }

        return true;
    }

    function bruteForceSolver(board) {
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) {
                for (let num = 1; num <= 9; num++) {
                    board[i] = num;
                    if (isValidSudoku(board) && bruteForceSolver(board)) {
                        return true;
                    }
                    board[i] = 0;
                }
                return false;
            }
        }
        return true;
    }

    function backtrackingSolver(board, pos = 0) {
        if (pos === 81) return true;

        const row = Math.floor(pos / 9);
        const col = pos % 9;

        if (board[pos] !== 0) return backtrackingSolver(board, pos + 1);

        for (let num = 1; num <= 9; num++) {
            if (isSafe(board, row, col, num)) {
                board[pos] = num;
                if (backtrackingSolver(board, pos + 1)) return true;
                board[pos] = 0;
            }
        }
        return false;
    }

    function isValidSudoku(board) {
        for (let i = 0; i < 9; i++) {
            const row = new Set();
            const col = new Set();
            const square = new Set();
            for (let j = 0; j < 9; j++) {
                const rowNum = board[i * 9 + j];
                const colNum = board[j * 9 + i];
                const squareNum = board[Math.floor(i / 3) * 27 + (i % 3) * 3 + Math.floor(j / 3) * 9 + j % 3];

                if (rowNum && row.has(rowNum)) return false;
                if (colNum && col.has(colNum)) return false;
                if (squareNum && square.has(squareNum)) return false;

                if (rowNum) row.add(rowNum);
                if (colNum) col.add(colNum);
                if (squareNum) square.add(squareNum);
            }
        }
        return true;
    }

    function solve(solver) {
        const board = getGrid();
        if (!isValidSudoku(board)) {
            status.textContent = "No solution exists!";
            return;
        }
        const startTime = performance.now();
        if (solver(board)) {
            const endTime = performance.now();
            const timeTaken = (endTime - startTime).toFixed(2);
            setGrid(board);
            status.textContent = `Solved in ${timeTaken} milliseconds.`;
        } else {
            status.textContent = "No solution exists!";
        }
    }

    function validateInput(event) {
        const input = event.target;
        const value = input.value;
        if (value && (!/^[1-9]$/.test(value) || isNaN(parseInt(value)))) {
            input.value = "";
            status.textContent = "Input must be an integer between 1 and 9!";
        } else {
            status.textContent = "";
        }
    }

    grid.forEach(input => input.addEventListener("input", validateInput));

    document.getElementById("bruteForceSolver").addEventListener("click", () => solve(bruteForceSolver));
    document.getElementById("backtrackingSolver").addEventListener("click", () => solve(backtrackingSolver));
    document.getElementById("clearButton").addEventListener("click", () => {
        setGrid(new Array(81).fill(0));
        status.textContent = "";
    });
});