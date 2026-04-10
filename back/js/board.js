import { grid } from "./cat.js";
import "./cells.js"; 
import { robotinhovermelho, robotinhoVerde } from "./entities.js";
import { basequadverde,basequadvermelho,basetriaverde,basetriavermelho } from "./entities.js";
function drawRobots(ctx, cellSize) {
  const robots = [robotinhovermelho, robotinhoVerde];
  const robotRadius = cellSize / 3.5;
  
  robots.forEach(robot => {
    const centerX = robot.col * cellSize + cellSize / 2;
    const centerY = robot.row * cellSize + cellSize / 2;
    
    ctx.fillStyle = robot.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, robotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBases(ctx, cellSize) {
  const bases = [
    basequadverde,
    basequadvermelho,
    basetriaverde,
    basetriavermelho
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
  const cellSize = 67; 
  const wallThickness = 5;


  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = grid[row][col];
      const x = col * cellSize;
      const y = row * cellSize;

      // grid leve
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ddd";
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