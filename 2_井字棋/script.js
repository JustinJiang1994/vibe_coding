// 游戏状态
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// 获胜组合
const winningConditions = [
    [0, 1, 2], // 第一行
    [3, 4, 5], // 第二行
    [6, 7, 8], // 第三行
    [0, 3, 6], // 第一列
    [1, 4, 7], // 第二列
    [2, 5, 8], // 第三列
    [0, 4, 8], // 主对角线
    [2, 4, 6]  // 副对角线
];

// DOM 元素
const cells = document.querySelectorAll('.cell');
const playerIndicator = document.getElementById('player-indicator');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');

// 初始化游戏
function initGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
    resetBtn.addEventListener('click', resetGame);
    updateDisplay();
}

// 处理单元格点击
function handleCellClick(index) {
    if (board[index] !== '' || !gameActive) {
        return;
    }

    // 放置棋子
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());
    cells[index].classList.add('disabled');

    // 检查游戏状态
    if (checkWinner()) {
        gameActive = false;
        gameStatus.textContent = `玩家 ${currentPlayer} 获胜！`;
        gameStatus.style.color = '#2ecc71';
        highlightWinningCells();
        updateScore(currentPlayer);
        disableAllCells();
    } else if (checkDraw()) {
        gameActive = false;
        gameStatus.textContent = '平局！';
        gameStatus.style.color = '#f39c12';
        updateScore('draw');
        disableAllCells();
    } else {
        // 切换玩家
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateDisplay();
    }
}

// 检查是否有获胜者
function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// 获取获胜的组合
function getWinningCombination() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return condition;
        }
    }
    return null;
}

// 高亮获胜的单元格
function highlightWinningCells() {
    const winningCombo = getWinningCombination();
    if (winningCombo) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winning');
        });
    }
}

// 检查是否平局
function checkDraw() {
    return board.every(cell => cell !== '') && !checkWinner();
}

// 更新显示
function updateDisplay() {
    playerIndicator.textContent = currentPlayer;
    playerIndicator.style.color = currentPlayer === 'X' ? '#e74c3c' : '#3498db';
    
    if (!gameActive) {
        playerIndicator.textContent = '-';
    }
}

// 更新得分
function updateScore(winner) {
    if (winner === 'X') {
        scores.X++;
        scoreX.textContent = scores.X;
    } else if (winner === 'O') {
        scores.O++;
        scoreO.textContent = scores.O;
    } else {
        scores.draw++;
        scoreDraw.textContent = scores.draw;
    }
}

// 禁用所有单元格
function disableAllCells() {
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });
}

// 重置游戏
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameStatus.textContent = '';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled', 'winning');
    });
    
    updateDisplay();
}

// 页面加载时初始化游戏
initGame();

