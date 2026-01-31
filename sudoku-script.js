// Sudoku Game Script

// Pre-defined Sudoku puzzles (0 represents empty cell)
const puzzles = {
    easy: [
        [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ],
        [
            [0,0,0,2,6,0,7,0,1],
            [6,8,0,0,7,0,0,9,0],
            [1,9,0,0,0,4,5,0,0],
            [8,2,0,1,0,0,0,4,0],
            [0,0,4,6,0,2,9,0,0],
            [0,5,0,0,0,3,0,2,8],
            [0,0,9,3,0,0,0,7,4],
            [0,4,0,0,5,0,0,3,6],
            [7,0,3,0,1,8,0,0,0]
        ]
    ],
    medium: [
        [
            [0,2,0,6,0,8,0,0,0],
            [5,8,0,0,0,9,7,0,0],
            [0,0,0,0,4,0,0,0,0],
            [3,7,0,0,0,0,5,0,0],
            [6,0,0,0,7,5,0,0,4],
            [0,0,8,0,0,0,0,1,3],
            [0,0,0,0,1,0,0,0,0],
            [0,0,0,8,0,0,0,5,2],
            [0,0,0,0,0,0,0,7,0]
        ]
    ],
    hard: [
        [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,3,0,8,5],
            [0,0,1,0,2,0,0,0,0],
            [0,0,0,5,0,7,0,0,0],
            [0,0,4,0,0,0,1,0,0],
            [0,9,0,0,0,0,0,0,0],
            [5,0,0,0,0,0,0,7,3],
            [0,0,2,0,1,0,0,0,0],
            [0,0,0,0,4,0,0,0,9]
        ]
    ]
};

// Current board
let currentBoard = [];
let originalBoard = [];
let timerInterval = null;
let startTime = null;
let difficulty = 'easy';

// Initialize the game
function initGame() {
    clearInterval(timerInterval);
    startTimer();
    generateBoard();
    renderBoard();
    document.getElementById('message').textContent = '';
}

// Generate board based on difficulty
function generateBoard() {
    const difficultyPuzzles = puzzles[difficulty];
    const randomIndex = Math.floor(Math.random() * difficultyPuzzles.length);
    currentBoard = difficultyPuzzles[randomIndex].map(row => [...row]);
    originalBoard = difficultyPuzzles[randomIndex].map(row => [...row]);
}

// Start timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Stop timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Render the Sudoku grid
function renderBoard() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (originalBoard[row][col] !== 0) {
                cell.classList.add('pre-filled');
                cell.textContent = originalBoard[row][col];
            } else {
                cell.contentEditable = true;
                cell.addEventListener('input', handleCellInput);
                cell.addEventListener('keydown', handleKeyDown);
                cell.addEventListener('focus', handleCellFocus);
                cell.addEventListener('blur', handleCellBlur);
                if (currentBoard[row][col] !== 0) {
                    cell.textContent = currentBoard[row][col];
                }
            }
            
            grid.appendChild(cell);
        }
    }
}

// Handle cell input
function handleCellInput(e) {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.textContent) || 0;
    
    if (value < 0 || value > 9) {
        cell.textContent = '';
        currentBoard[row][col] = 0;
        return;
    }
    
    currentBoard[row][col] = value;
    cell.classList.add('input-animation');
    setTimeout(() => cell.classList.remove('input-animation'), 500);
}

// Handle keydown to restrict input
function handleKeyDown(e) {
    const key = e.key;
    if (!/[1-9]/.test(key) && key !== 'Backspace' && key !== 'Delete') {
        e.preventDefault();
    }
}

// Handle cell focus
function handleCellFocus(e) {
    const cell = e.target;
    cell.classList.add('focused');
}

// Handle cell blur
function handleCellBlur(e) {
    const cell = e.target;
    cell.classList.remove('focused');
}

// Check if the current board is a valid Sudoku solution
function checkSolution() {
    const message = document.getElementById('message');
    
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentBoard[row][col] === 0) {
                showMessage('Board is not complete!', 'error');
                return;
            }
        }
    }
    
    // Check rows
    for (let row = 0; row < 9; row++) {
        if (!isValidSet(currentBoard[row])) {
            showMessage('Invalid solution! Check rows.', 'error');
            animateInvalidCells(row, 'row');
            return;
        }
    }
    
    // Check columns
    for (let col = 0; col < 9; col++) {
        const column = currentBoard.map(row => row[col]);
        if (!isValidSet(column)) {
            showMessage('Invalid solution! Check columns.', 'error');
            animateInvalidCells(col, 'col');
            return;
        }
    }
    
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const box = [];
            for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
                for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
                    box.push(currentBoard[row][col]);
                }
            }
            if (!isValidSet(box)) {
                showMessage('Invalid solution! Check 3x3 boxes.', 'error');
                animateInvalidCells(boxRow * 3 + boxCol, 'box');
                return;
            }
        }
    }
    
    // Success!
    stopTimer();
    showMessage('Congratulations! Valid solution!', 'success');
    animateSuccess();
}

// Show message with animation
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
}

// Animate invalid cells
function animateInvalidCells(index, type) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        let shouldAnimate = false;
        
        if (type === 'row' && row === index) shouldAnimate = true;
        else if (type === 'col' && col === index) shouldAnimate = true;
        else if (type === 'box') {
            const boxRow = Math.floor(row / 3);
            const boxCol = Math.floor(col / 3);
            const boxIndex = boxRow * 3 + boxCol;
            if (boxIndex === index) shouldAnimate = true;
        }
        
        if (shouldAnimate) {
            cell.classList.add('error');
            setTimeout(() => cell.classList.remove('error'), 2000);
        }
    });
}

// Animate success
function animateSuccess() {
    const cells = document.querySelectorAll('.cell:not(.pre-filled)');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('success');
            setTimeout(() => cell.classList.remove('success'), 1000);
        }, index * 50);
    });
}

// Reset board
function resetBoard() {
    currentBoard = originalBoard.map(row => [...row]);
    renderBoard();
    showMessage('Board reset!', 'info');
}

// Change difficulty
function changeDifficulty() {
    difficulty = document.getElementById('difficulty-select').value;
    initGame();
}

// Event listeners
document.getElementById('new-game-btn').addEventListener('click', initGame);
document.getElementById('check-btn').addEventListener('click', checkSolution);
document.getElementById('reset-btn').addEventListener('click', resetBoard);
document.getElementById('difficulty-select').addEventListener('change', changeDifficulty);

// Initialize the game on load
document.addEventListener('DOMContentLoaded', initGame);