import { grid } from "./cat.js";
import { robotinhovermelho, robotinhoVerde, basequadverde, basequadvermelho, basetriaverde, basetriavermelho } from "./entities.js";
import { objetivo, randomizeObjective } from "./main.js";

const robots = [robotinhovermelho, robotinhoVerde];
let isAutoCounting = false;
let autoMoveCount = 0;
const moveCounterValueElement = document.getElementById("move-counter-value");
const initialRobotState = {
  red: { row: robotinhovermelho.row, col: robotinhovermelho.col },
  green: { row: robotinhoVerde.row, col: robotinhoVerde.col }
};

function updateMoveCounter() {
  if (moveCounterValueElement) {
    moveCounterValueElement.textContent = String(autoMoveCount);
  }
}


function resetMoveCounter() {
  autoMoveCount = 0;
  updateMoveCounter();
}

function resetGameState() {
  robotinhovermelho.row = initialRobotState.red.row;
  robotinhovermelho.col = initialRobotState.red.col;
  robotinhoVerde.row = initialRobotState.green.row;
  robotinhoVerde.col = initialRobotState.green.col;

  robotinhovermelho.moves = 0;
  robotinhoVerde.moves = 0;

  activeRobot = robotinhovermelho;
  isAutoCounting = false;
  resetMoveCounter();
  randomizeObjective();

  window.dispatchEvent(new Event("robotMoved"));
  console.log("♻️ Partida resetada para o estado inicial.");
}

// Função para mover o robô (desliza até encostar numa barreira)
async function moveRobot(robot, direction) {
  const DELAY = 15;
  let moved = false;

  if (direction === "up") {
    while (
      robot.row > 0 &&
      !grid[robot.row][robot.col].top &&
      !(robot.row === 4 && robot.col === 4) &&
      !hasRobot(robot.row - 1, robot.col, robot) 
    ) {
      robot.row--;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }

  } else if (direction === "down") {
    while (
      robot.row < 8 &&
      !grid[robot.row][robot.col].bottom &&
      !(robot.row === 4 && robot.col === 4) &&
      !hasRobot(robot.row + 1, robot.col, robot) 
    ) {
      robot.row++;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }

  } else if (direction === "left") {
    while (
      robot.col > 0 &&
      !grid[robot.row][robot.col].left &&
      !(robot.row === 4 && robot.col === 4) &&
      !hasRobot(robot.row, robot.col - 1, robot) 
    ) {
      robot.col--;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }

  } else if (direction === "right") {
    while (
      robot.col < 8 &&
      !grid[robot.row][robot.col].right &&
      !(robot.row === 4 && robot.col === 4) &&
      !hasRobot(robot.row, robot.col + 1, robot) 
    ) {
      robot.col++;
      moved = true;
      window.dispatchEvent(new Event("robotMoved"));
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  if (moved) {
    autoMoveCount++;
    updateMoveCounter();
    robot.moves++;
    console.log(`Robô ${robot.color} move para ${direction}. Posição: [${robot.row}, ${robot.col}]`);
  }

  return moved;
}

function slidePosition(row, col, direction, blockRow, blockCol) {
  let newRow = row;
  let newCol = col;

  const isBlocked = (nextRow, nextCol) => nextRow === blockRow && nextCol === blockCol;

  if (direction === "up") {
    while (
      newRow > 0 &&
      !grid[newRow][newCol].top &&
      !(newRow === 4 && newCol === 4) &&
      !isBlocked(newRow - 1, newCol)
    ) {
      newRow--;
    }

  } else if (direction === "down") {
    while (
      newRow < 8 &&
      !grid[newRow][newCol].bottom &&
      !(newRow === 4 && newCol === 4) &&
      !isBlocked(newRow + 1, newCol)
    ) {
      newRow++;
    }

  } else if (direction === "left") {
    while (
      newCol > 0 &&
      !grid[newRow][newCol].left &&
      !(newRow === 4 && newCol === 4) &&
      !isBlocked(newRow, newCol - 1)
    ) {
      newCol--;
    }

  } else if (direction === "right") {
    while (
      newCol < 8 &&
      !grid[newRow][newCol].right &&
      !(newRow === 4 && newCol === 4) &&
      !isBlocked(newRow, newCol + 1)
    ) {
      newCol++;
    }
  }

  return { row: newRow, col: newCol };
}

function getBaseForRobot(robot) {
  switch (objetivo) {
    case 1: return basequadvermelho;
    case 2: return basequadverde;
    case 3: return basetriavermelho;
    case 4: return basetriaverde;
    default: return basequadvermelho; // Fallback
  }
}

function hasRobot(row, col, ignoreRobot) {
  return robots.some(r => r !== ignoreRobot && r.row === row && r.col === col);
  
}

// BFS no estado conjunto (vermelho + verde), permitindo usar o robô auxiliar
function bfs(robot, targetBase) {
  const queue = [[robotinhovermelho.row, robotinhovermelho.col, robotinhoVerde.row, robotinhoVerde.col, []]];
  const visited = new Set();
  visited.add(`${robotinhovermelho.row},${robotinhovermelho.col}|${robotinhoVerde.row},${robotinhoVerde.col}`);

  const directions = ["up", "down", "left", "right"];
  const targetRobotColor = targetBase.color;
  while (queue.length > 0) {
    const [redRow, redCol, greenRow, greenCol, path] = queue.shift();
    const robotAtTarget = (targetRobotColor === "red") 
        ? (redRow === targetBase.row && redCol === targetBase.col)
        : (greenRow === targetBase.row && greenCol === targetBase.col);

    if (robotAtTarget) {
      console.log(`✅ Base encontrada! Passos: ${path.length}`);
      return path;
    }

    for (const movingColor of ["red", "green"]) {
      for (const dir of directions) {
        const movingRed = movingColor === "red";

        const moverRow = movingRed ? redRow : greenRow;
        const moverCol = movingRed ? redCol : greenCol;
        const blockerRow = movingRed ? greenRow : redRow;
        const blockerCol = movingRed ? greenCol : redCol;

        const next = slidePosition(moverRow, moverCol, dir, blockerRow, blockerCol);

        if (next.row === moverRow && next.col === moverCol) continue;

        const nextRedRow = movingRed ? next.row : redRow;
        const nextRedCol = movingRed ? next.col : redCol;
        const nextGreenRow = movingRed ? greenRow : next.row;
        const nextGreenCol = movingRed ? greenCol : next.col;

        const stateKey = `${nextRedRow},${nextRedCol}|${nextGreenRow},${nextGreenCol}`;
        if (visited.has(stateKey)) continue;

        visited.add(stateKey);
        queue.push([
          nextRedRow,
          nextRedCol,
          nextGreenRow,
          nextGreenCol,
          [...path, { robot: movingColor, direction: dir }]
        ]);
      }
    }
  }

  console.log("❌ Base não alcançável!");
  return null;
}

async function moveRobotByBfs(robot) {
  const targetBase = getBaseForRobot(robot);
  console.log(`\n🤖 Calculando caminho para base retangular ${targetBase.color}...`);

  resetMoveCounter();
  isAutoCounting = true;

  const path = bfs(robot, targetBase);
  if (!path) {
    isAutoCounting = false;
    console.log("❌ Não foi possível encontrar caminho.");
    return false;
  }

  console.log(`📊 Caminho encontrado com ${path.length} movimentos (incluindo robô auxiliar).`);
  for (const step of path) {
    const movingRobot = step.robot === "red" ? robotinhovermelho : robotinhoVerde;
    await moveRobot(movingRobot, step.direction);
  }

  isAutoCounting = false;

  return true;
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

  // B para calcular e executar BFS até base retangular da mesma cor
  if (e.key === "b" || e.key === "B") {
    if (isMoving) return;
    isMoving = true;
    // O robô ativo é passado como referência, mas o BFS usará o 'objetivo' global
    await moveRobotByBfs(activeRobot);
    isMoving = false;
  }
});

const solveButton = document.getElementById("solve-btn");
if (solveButton) {
  solveButton.addEventListener("click", async () => {
    if (isMoving) return;
    isMoving = true;
    solveButton.disabled = true;
    await moveRobotByBfs(activeRobot);
    solveButton.disabled = false;
    isMoving = false;
  });
}

const resetButton = document.getElementById("reset-btn");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    if (isMoving) return;
    resetGameState();
  });
}

const secondResetButton = document.getElementById("reset-btn-2");
if (secondResetButton) {
  secondResetButton.addEventListener("click", () => {
    if (isMoving) return;
    resetGameState();
  });
}

console.log("✅ Sistema de movimentação carregado!");
console.log("🔴 Robô Vermelho selecionado por padrão");
console.log("🎮 Controles:");
console.log("  ⬆️⬇️⬅️➡️  = Mover robô");
console.log("  R = Trocar robô");
console.log("  B = Resolver para base retangular da cor do robô");

export { moveRobot, bfs, activeRobot, moveRobotByBfs, resetGameState };
