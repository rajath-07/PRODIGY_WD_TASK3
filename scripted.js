// Existing game logic...

const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

let currentPlayer = 'X';
let gameState = Array(9).fill(null); // Stores the state of each cell
let gameActive = true;
let isPlayingWithComputer = sessionStorage.getItem('playWithComputer') === 'true'; // Check mode from sessionStorage

// Winning combinations for a 3x3 board
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8]  // Columns
];

// Initialize game by adding event listeners to cells and restart button
function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    updateStatusText(); // Set initial player turn
    document.body.classList.add('x-turn'); // Start with Player X's turn color
}

// Update the status text to display the current player's turn
function updateStatusText() {
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Handle each cell click
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    // Check if cell is already filled or game is not active
    if (gameState[cellIndex] || !gameActive) return;

    // Player move
    gameState[cellIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;

    // Check if there's a winner
    if (checkWinner()) {
        showWinnerMessage(`Player ${currentPlayer} Wins!`);
        return;
    } else if (!gameState.includes(null)) {
        showDrawMessage();
        return;
    }

    // Switch to the other player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatusText(); // Update turn display

    // Update background color based on the current player
    document.body.classList.toggle('x-turn', currentPlayer === 'X');
    document.body.classList.toggle('o-turn', currentPlayer === 'O');

    // If playing with the computer and it's 'O's turn, make computer move
    if (isPlayingWithComputer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500); // Add delay for a realistic feel
    }
}

// Computer's move logic
function computerMove() {
    // Choose a random empty cell
    const emptyCells = gameState
        .map((cell, index) => cell === null ? index : null)
        .filter(index => index !== null);

    if (emptyCells.length === 0) return; // No moves left

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = 'O';
    const cell = cells[randomIndex];
    cell.classList.add('o');
    cell.textContent = 'O';

    // Check for a win or draw after computer's move
    if (checkWinner()) {
        showWinnerMessage(`Player ${currentPlayer} Wins!`);
        return;
    } else if (!gameState.includes(null)) {
        showDrawMessage();
        return;
    }

    // Switch back to Player X's turn
    currentPlayer = 'X';
    updateStatusText(); // Update turn display
    document.body.classList.add('x-turn');
    document.body.classList.remove('o-turn');
}

// Check for a winner
function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

// Show the winner message with sound and animation
function showWinnerMessage(message) {
    gameActive = false;
    const winSound = document.getElementById('winSound');
    winSound.play();

    const winnerMessageElement = document.createElement('div');
    winnerMessageElement.classList.add('winner-message');
    winnerMessageElement.textContent = message;

    document.body.appendChild(winnerMessageElement);

    // Remove the winner message after 3 seconds
    setTimeout(() => {
        winnerMessageElement.remove();
    }, 3000); // Show for 3 seconds
}

// Show the draw message with sound and animation
function showDrawMessage() {
    gameActive = false;
    const drawSound = document.getElementById('drawSound');
    drawSound.play();

    const drawMessageElement = document.createElement('div');
    drawMessageElement.classList.add('winner-message'); // Use same class for styling
    drawMessageElement.textContent = "It's a Draw!";

    document.body.appendChild(drawMessageElement);

    // Remove the draw message after 3 seconds
    setTimeout(() => {
        drawMessageElement.remove();
    }, 3000); // Show for 3 seconds
}

// Restart the game
function restartGame() {
    gameState.fill(null);
    gameActive = true;
    currentPlayer = 'X';
    updateStatusText(); // Reset to Player X's turn
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });

    // Reset to Player X's color
    document.body.classList.add('x-turn');
    document.body.classList.remove('o-turn');

    // Ensure no winner or draw message is shown
    const existingMessage = document.querySelector('.winner-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Start the game
initializeGame();
