import { grid } from "./cat.js";
import "./cells.js"; 

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
}


window.addEventListener('load', draw);