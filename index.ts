const canvas = document.createElement("canvas");
const container = document.getElementById("canvas-container");
if (container) {
  container.appendChild(canvas);
}

const canvasSize = 600;
const cellsPerRow = 10;
const cellSize = canvasSize / cellsPerRow;

canvas.width = canvasSize;
canvas.height = canvasSize;

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No context");

const drawCell = (x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

drawCell(0, 0, "green");
drawCell(0, 1, "red");
drawCell(1, 1, "black");
