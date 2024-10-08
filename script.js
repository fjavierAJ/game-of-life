const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

let grid = buildGrid();
let animation;

function buildGrid() {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(0));
}

function randomize() {
    grid = grid.map(col => col.map(() => Math.floor(Math.random() * 2)));
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
}

function updateGrid() {
    const nextGen = grid.map(arr => [...arr]);

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            const numNeighbors = countNeighbors(grid, col, row);

            if (cell === 1 && numNeighbors < 2) {
                nextGen[col][row] = 0;  // Muerte por soledad
            } else if (cell === 1 && numNeighbors > 3) {
                nextGen[col][row] = 0;  // Muerte por sobrepoblación
            } else if (cell === 0 && numNeighbors === 3) {
                nextGen[col][row] = 1;  // Nacimiento
            }
        }
    }

    grid = nextGen;
    drawGrid();
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    const cols = grid.length;
    const rows = grid[0].length;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            const col = (x + i + cols) % cols;
            const row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    return sum;
}

function startGame() {
    if (!animation) {
        animation = setInterval(() => {
            updateGrid();
        }, 100);
    }
}

function pauseGame() {
    clearInterval(animation);
    animation = null;
}

function clearGrid() {
    grid = buildGrid();
    drawGrid();
}

canvas.addEventListener('click', (event) => {
    const x = Math.floor(event.offsetX / resolution);
    const y = Math.floor(event.offsetY / resolution);
    grid[x][y] = grid[x][y] ? 0 : 1;
    drawGrid();
});

randomize();  // Iniciar con una cuadrícula aleatoria
