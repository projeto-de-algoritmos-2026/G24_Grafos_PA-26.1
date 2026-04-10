import { grid } from "./cat.js";
import { robotinhovermelho, robotinhoVerde, basetriaverde, basetriavermelho } from "./entities.js";

// Função para mover o robô (desliza até encostar numa barreira) - COM ANIMAÇÃO
async function moveRobot(robot, direction) {
  const DELAY = 5; // milliseconds entre cada célula
  let moved = false;

  if (direction === "up") {
    while (robot.row > 0 && !grid[robot.row][robot.col].top && !(robot.row === 4 && robot.col === 4)) {
      robot.row--;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  } else if (direction === "down") {
    while (robot.row < 8 && !grid[robot.row][robot.col].bottom && !(robot.row === 4 && robot.col === 4)) {
      robot.row++;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  } else if (direction === "left") {
    while (robot.col > 0 && !grid[robot.row][robot.col].left && !(robot.row === 4 && robot.col === 4)) {
      robot.col--;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  } else if (direction === "right") {
    while (robot.col < 8 && !grid[robot.row][robot.col].right && !(robot.row === 4 && robot.col === 4)) {
      robot.col++;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  if (moved) {
    robot.moves++;
    console.log(`Robô ${robot.color} move para ${direction}. Posição: [${robot.row}, ${robot.col}]`);
  }

  return moved;
}

// BFS para encontrar caminho mais curto (considerando deslizamento)
function bfs(robot, targetBase) {
  const queue = [[robot.row, robot.col, 0]]; // [row, col, steps]
  const visited = new Set();
  visited.add(`${robot.row},${robot.col}`);

  const directions = [
    { name: "up", dr: -1, dc: 0 },
    { name: "down", dr: 1, dc: 0 },
    { name: "left", dr: 0, dc: -1 },
    { name: "right", dr: 0, dc: 1 }
  ];

  while (queue.length > 0) {
    const [row, col, steps] = queue.shift();

    // Verificar se chegou na base
    if (row === targetBase.row && col === targetBase.col) {
      console.log(`✅ Base encontrada! Passos: ${steps}`);
      return steps;
    }

    // Explorar todas as direções de deslizamento
    for (const dir of directions) {
      let newRow = row;
      let newCol = col;

      // Deslizar na direção até encostar numa barreira ou centro
      if (dir.name === "up") {  
        while (newRow > 0 && !grid[newRow][newCol].top) {
          newRow--;
        }
      } else if (dir.name === "down") {
        while (newRow < 8 && !grid[newRow][newCol].bottom) {
          newRow++;
        }
      } else if (dir.name === "left") {
        while (newCol > 0 && !grid[newRow][newCol].left) {
          newCol--;
        }
      } else if (dir.name === "right") {
        while (newCol < 8 && !grid[newRow][newCol].right) {
          newCol++;
        }
      }

      // Se não se moveu, pula
      if (newRow === row && newCol === col) continue;

      // Se tentou ir para o centro, pula (não pode passar)
      if (newRow === 4 && newCol === 4) continue;

      // Se já visitou, pula
      if (visited.has(`${newRow},${newCol}`)) continue;

      visited.add(`${newRow},${newCol}`);
      queue.push([newRow, newCol, steps + 1]);
    }
  }

  console.log("❌ Base não alcançável!");
  return -1;
}

// Controles do teclado
let activeRobot = robotinhovermelho; // Robô selecionado por padrão
let isMoving = false; // Impede múltiplos movimentos simultâneos

document.addEventListener("keydown", async (e) => {
  if (isMoving && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    return; // Ignora input enquanto está se movendo
  }

  // Setas para mover
  if (e.key === "ArrowUp") {
    isMoving = true;
    await moveRobot(activeRobot, "up");
    isMoving = false;
  } else if (e.key === "ArrowDown") {
    isMoving = true;
    await moveRobot(activeRobot, "down");
    isMoving = false;
  } else if (e.key === "ArrowLeft") {
    isMoving = true;
    await moveRobot(activeRobot, "left");
    isMoving = false;
  } else if (e.key === "ArrowRight") {
    isMoving = true;
    await moveRobot(activeRobot, "right");
    isMoving = false;
  }

  // R para trocar de robô
  if (e.key === "r" || e.key === "R") {
    if (activeRobot === robotinhovermelho) {
      activeRobot = robotinhoVerde;
      console.log(`🟢 Robô Verde selecionado!`);
    } else {
      activeRobot = robotinhovermelho;
      console.log(`🔴 Robô Vermelho selecionado!`);
    }
  }

  // B para calcular BFS até base de triângulo
  if (e.key === "b" || e.key === "B") {
    let targetBase = activeRobot.color === "red" ? basetriavermelho : basetriaverde;
    console.log(`\n🤖 Calculando caminho mais curto para base de ${targetBase.color}...`);
    const steps = bfs(activeRobot, targetBase);
    if (steps !== -1) {
      console.log(`📊 Resultado: ${steps} passos até a base de triângulo de ${targetBase.color}!`);
    }
  }
});

console.log("✅ Sistema de movimentação carregado!");
console.log("🔴 Robô Vermelho selecionado por padrão");
console.log("🎮 Controles:");
console.log("  ⬆️⬇️⬅️➡️  = Mover robô");
console.log("  R = Trocar robô");
console.log("  B = Calcular BFS");

export { moveRobot, bfs, activeRobot };
