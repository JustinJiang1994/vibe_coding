// 游戏配置
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const GRID_COUNT = CANVAS_SIZE / GRID_SIZE;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// 游戏状态
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;

// 初始化
highScoreElement.textContent = highScore;

// 生成食物位置
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
        food.x * GRID_SIZE + 2,
        food.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
    );
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = '#2ecc71';
        } else {
            // 蛇身
            ctx.fillStyle = '#27ae60';
        }
        ctx.fillRect(
            segment.x * GRID_SIZE + 2,
            segment.y * GRID_SIZE + 2,
            GRID_SIZE - 4,
            GRID_SIZE - 4
        );
    });
}

// 更新游戏状态
function update() {
    if (!gameRunning || gamePaused) return;
    
    // 移动蛇头
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
        gameOver();
        return;
    }
    
    // 检查自身碰撞
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
        
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        snake.pop();
    }
}

// 游戏循环
function gameStep() {
    update();
    draw();
}

// 开始游戏
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    food = generateFood();
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gamePaused = false;
    gameOverElement.classList.add('hidden');
    
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    gameLoop = setInterval(gameStep, 150);
    draw();
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

// 暂停/继续游戏
function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(gameLoop);
    } else {
        gameLoop = setInterval(gameStep, 150);
    }
}

// 改变方向
function changeDirection(newDirection) {
    if (!gameRunning) {
        startGame();
        return;
    }
    
    // 防止反向移动
    if (
        (newDirection.x === -direction.x && newDirection.y === direction.y) ||
        (newDirection.y === -direction.y && newDirection.x === direction.x)
    ) {
        return;
    }
    
    direction = newDirection;
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection({ x: 0, y: -1 });
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection({ x: 0, y: 1 });
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection({ x: -1, y: 0 });
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection({ x: 1, y: 0 });
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

// 移动端按钮控制
document.getElementById('btnUp').addEventListener('click', () => {
    changeDirection({ x: 0, y: -1 });
});

document.getElementById('btnDown').addEventListener('click', () => {
    changeDirection({ x: 0, y: 1 });
});

document.getElementById('btnLeft').addEventListener('click', () => {
    changeDirection({ x: -1, y: 0 });
});

document.getElementById('btnRight').addEventListener('click', () => {
    changeDirection({ x: 1, y: 0 });
});

// 重新开始按钮
restartBtn.addEventListener('click', startGame);

// 初始化绘制
draw();

