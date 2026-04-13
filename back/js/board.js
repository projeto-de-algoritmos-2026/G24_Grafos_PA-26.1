import { grid } from "./cat.js";
import "./cells.js"; 
import "./movement.js";
import { robotinhovermelho, robotinhoVerde, robotinhoAmarelo, robotinhoAzul } from "./entities.js";
import { basequadverde,basequadvermelho,basequadamarelo,basequadazul,basetriaazul,basetriamarelo,basetriaverde,basetriavermelho } from "./entities.js";

const GRID_SIZE = 16;
const CELL_SIZE = 37.5;
const ROBOT_RADIUS = CELL_SIZE / 3.5;

function getCssColor(variableName, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

let draggingRobot = null;
let dragPointerX = null;
let dragPointerY = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function getCanvasCoordinates(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function getRobotAtPosition(x, y) {
  const robots = [robotinhovermelho, robotinhoVerde, robotinhoAzul, robotinhoAmarelo];

  for (const robot of robots) {
    const centerX = robot.col * CELL_SIZE + CELL_SIZE / 2;
    const centerY = robot.row * CELL_SIZE + CELL_SIZE / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= ROBOT_RADIUS) {
      return robot;
    }
  }

  return null;
}

function isCellOccupied(row, col, robotToIgnore) {
  const robots = [robotinhovermelho, robotinhoVerde, robotinhoAmarelo,robotinhoAzul];
  return robots.some(robot => robot !== robotToIgnore && robot.row === row && robot.col === col);
}

// função para mover uma entidade segurando e arrastando
function setupDragAndDrop() {
  const canvas = document.getElementById("toy-canvas");
  if (!canvas) return;

  canvas.addEventListener("pointerdown", (event) => {
    const point = getCanvasCoordinates(canvas, event);
    const robot = getRobotAtPosition(point.x, point.y);
    if (!robot) return;

    draggingRobot = robot;
    const centerX = robot.col * CELL_SIZE + CELL_SIZE / 2;
    const centerY = robot.row * CELL_SIZE + CELL_SIZE / 2;
    dragOffsetX = centerX - point.x;
    dragOffsetY = centerY - point.y;
    dragPointerX = point.x + dragOffsetX;
    dragPointerY = point.y + dragOffsetY;
    canvas.style.cursor = "grabbing";

    canvas.setPointerCapture(event.pointerId);
    draw();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!draggingRobot) return;

    const point = getCanvasCoordinates(canvas, event);
    dragPointerX = point.x + dragOffsetX;
    dragPointerY = point.y + dragOffsetY;
    draw();
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!draggingRobot) return;

    const point = getCanvasCoordinates(canvas, event);
    const previewX = point.x + dragOffsetX;
    const previewY = point.y + dragOffsetY;
    const col = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(previewX / CELL_SIZE)));
    const row = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(previewY / CELL_SIZE)));

    const isCenterCell = row === 4 && col === 4;
    const occupied = isCellOccupied(row, col, draggingRobot);

    if (!isCenterCell && !occupied) {
      draggingRobot.row = row;
      draggingRobot.col = col;
      draggingRobot.renderRow = row;
      draggingRobot.renderCol = col;
      window.dispatchEvent(new Event("robotMoved"));
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    canvas.style.cursor = "default";
    dragPointerX = null;
    dragPointerY = null;
    dragOffsetX = 0;
    dragOffsetY = 0;
    draggingRobot = null;
    draw();
  });

  canvas.addEventListener("pointercancel", () => {
    canvas.style.cursor = "default";
    dragPointerX = null;
    dragPointerY = null;
    dragOffsetX = 0;
    dragOffsetY = 0;
    draggingRobot = null;
    draw();
  });
}


function drawRobots(ctx, cellSize) {
  const robots = [robotinhovermelho, robotinhoVerde, robotinhoAmarelo, robotinhoAzul];
  const robotRadius = ROBOT_RADIUS;
  
  robots.forEach(robot => {
    const renderCol = Number.isFinite(robot.renderCol) ? robot.renderCol : robot.col;
    const renderRow = Number.isFinite(robot.renderRow) ? robot.renderRow : robot.row;
    const centerX = robot === draggingRobot && dragPointerX !== null
      ? dragPointerX
      : renderCol * cellSize + cellSize / 2;
    const centerY = robot === draggingRobot && dragPointerY !== null
      ? dragPointerY
      : renderRow * cellSize + cellSize / 2;
    
    ctx.fillStyle = robot.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, robotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBases(ctx, cellSize) {
  const bases = [
    basequadverde,
    basequadamarelo,
    basequadazul,
    basequadvermelho,
    basetriaverde,
    basetriavermelho,
    basetriamarelo,
    basetriaazul
  ];

  const size = cellSize / 2.5;

  bases.forEach(base => {
    const centerX = base.col * cellSize + cellSize / 2;
    const centerY = base.row * cellSize + cellSize / 2;

    ctx.fillStyle = base.color;

    if (base.format === "quadrado") {
      ctx.fillRect(
        centerX - size / 2,
        centerY - size / 2,
        size,
        size
      );
    }
    if (base.format === "triangulo") {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size / 2); // topo
      ctx.lineTo(centerX - size / 2, centerY + size / 2); // esquerda
      ctx.lineTo(centerX + size / 2, centerY + size / 2); // direita
      ctx.closePath();
      ctx.fill();
    }
  });
}


function draw() {
  const canvas = document.getElementById("toy-canvas");
  if (!canvas) return console.log("ERRO AO RENDERIZAR CANVAS"); 
  const ctx = canvas.getContext("2d");
  const cellSize = CELL_SIZE; 
  const wallThickness = 5;
  const boardBgColor = getCssColor("--board-bg", "#ffffff");
  const gridColor = getCssColor("--grid-color", "#dddddd");


  ctx.fillStyle = boardBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      const x = col * cellSize;
      const y = row * cellSize;

      // grid leve
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridColor;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // centro
      if (cell.center) {
        ctx.fillStyle = "#393939";
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      // paredes
      ctx.fillStyle = "#000000";
      if (cell.top) ctx.fillRect(x, y, cellSize, wallThickness);
      if (cell.bottom) ctx.fillRect(x, y + cellSize - wallThickness, cellSize, wallThickness);
      if (cell.left) ctx.fillRect(x, y, wallThickness, cellSize);
      if (cell.right) ctx.fillRect(x + cellSize - wallThickness, y, wallThickness, cellSize);
    }
  }

  drawRobots(ctx, cellSize);
  drawBases(ctx,cellSize);
}


window.addEventListener('load', draw);
window.addEventListener('load', setupDragAndDrop);

// Redraw quando o robô se mover
window.addEventListener('robotMoved', draw);