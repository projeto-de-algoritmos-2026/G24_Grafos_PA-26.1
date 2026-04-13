import { grid } from "./cat.js";
import { robotinhovermelho, robotinhoVerde,robotinhoAmarelo,robotinhoAzul, basequadverde, basequadvermelho, basetriaverde, basetriavermelho,basequadamarelo,basetriaazul,basequadazul,basetriamarelo } from "./entities.js";
import { objetivo } from "./main.js";

const robots = [robotinhovermelho, robotinhoVerde,robotinhoAmarelo,robotinhoAzul];
let isAutoCounting = false;
let autoMoveCount = 0;
const moveCounterValueElement = document.getElementById("move-counter-value");
const STEP_DURATION_MS = 120;
const initialRobotState = {
  red: { row: robotinhovermelho.row, col: robotinhovermelho.col },
  green: { row: robotinhoVerde.row, col: robotinhoVerde.col },
  yellow:{ row: robotinhoAmarelo.row, col: robotinhoAmarelo.col},
  blue:{ row: robotinhoAzul.row, col: robotinhoAzul.col}
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animateRobotToCell(robot, fromRow, fromCol, toRow, toCol, duration = STEP_DURATION_MS) {
  if (duration <= 0) {
    robot.renderRow = toRow;
    robot.renderCol = toCol;
    window.dispatchEvent(new Event("robotMoved"));
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      robot.renderRow = fromRow + (toRow - fromRow) * t;
      robot.renderCol = fromCol + (toCol - fromCol) * t;
      window.dispatchEvent(new Event("robotMoved"));

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        robot.renderRow = toRow;
        robot.renderCol = toCol;
        window.dispatchEvent(new Event("robotMoved"));
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

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
  robotinhovermelho.renderRow = initialRobotState.red.row;
  robotinhovermelho.renderCol = initialRobotState.red.col;
  robotinhoVerde.row = initialRobotState.green.row;
  robotinhoVerde.col = initialRobotState.green.col;
  robotinhoVerde.renderRow = initialRobotState.green.row;
  robotinhoVerde.renderCol = initialRobotState.green.col;
  robotinhoAmarelo.row = initialRobotState.yellow.row;
  robotinhoAmarelo.col = initialRobotState.yellow.col;
  robotinhoAmarelo.renderRow = initialRobotState.yellow.row;
  robotinhoAmarelo.renderCol = initialRobotState.yellow.col;
  robotinhoAzul.row = initialRobotState.blue.row;
  robotinhoAzul.col = initialRobotState.blue.col;
  robotinhoAzul.renderRow = initialRobotState.blue.row;
  robotinhoAzul.renderCol = initialRobotState.blue.col;


  robotinhovermelho.moves = 0;
  robotinhoVerde.moves = 0;
  robotinhoAmarelo.moves = 0;
  robotinhoAzul.moves = 0;

  activeRobot = robotinhovermelho;
  isAutoCounting = false;
  resetMoveCounter();

  window.dispatchEvent(new Event("robotMoved"));
  console.log("Partida resetada para o estado inicial.");
}

// Função para mover o robô (desliza até encostar numa barreira)
async function moveRobot(robot, direction) {
  let moved = false;

  if (!Number.isFinite(robot.renderRow) || !Number.isFinite(robot.renderCol)) {
    robot.renderRow = robot.row;
    robot.renderCol = robot.col;
  }

  if (direction === "up") {
    while (
      robot.row > 0 &&
      !grid[robot.row][robot.col].top &&
      !((robot.row === 7 || robot.row === 8) && (robot.col === 7 || robot.col === 8)) &&
      !hasRobot(robot.row - 1, robot.col, robot) 
    ) {
      const fromRow = robot.row;
      const fromCol = robot.col;
      robot.row--;
      moved = true;
      await animateRobotToCell(robot, fromRow, fromCol, robot.row, robot.col);
    }

  } else if (direction === "down") {
    while (
      robot.row < 15 &&
      !grid[robot.row][robot.col].bottom &&
      !((robot.row === 7 || robot.row === 8) && (robot.col === 7 || robot.col === 8)) &&
      !hasRobot(robot.row + 1, robot.col, robot) 
    ) {
      const fromRow = robot.row;
      const fromCol = robot.col;
      robot.row++;
      moved = true;
      await animateRobotToCell(robot, fromRow, fromCol, robot.row, robot.col);
    }

  } else if (direction === "left") {
    while (
      robot.col > 0 &&
      !grid[robot.row][robot.col].left &&
      !((robot.row === 7 || robot.row === 8) && (robot.col === 7 || robot.col === 8)) &&
      !hasRobot(robot.row, robot.col - 1, robot) 
    ) {
      const fromRow = robot.row;
      const fromCol = robot.col;
      robot.col--;
      moved = true;
      await animateRobotToCell(robot, fromRow, fromCol, robot.row, robot.col);
    }

  } else if (direction === "right") {
    while (
      robot.col < 15 &&
      !grid[robot.row][robot.col].right &&
      !((robot.row === 7 || robot.row === 8) && (robot.col === 7 || robot.col === 8)) &&
      !hasRobot(robot.row, robot.col + 1, robot) 
    ) {
      const fromRow = robot.row;
      const fromCol = robot.col;
      robot.col++;
      moved = true;
      await animateRobotToCell(robot, fromRow, fromCol, robot.row, robot.col);
    }
  }

  if (!moved) {
    await sleep(2);
  }

  if (moved) {
    autoMoveCount++;
    updateMoveCounter();
    robot.moves++;
    console.log(`Robô ${robot.color} move para ${direction}. Posição: [${robot.row}, ${robot.col}]`);
  }

  return moved;
}

function slidePosition(row, col, direction, blockers = []) {
  let newRow = row;
  let newCol = col;

  const isBlocked = (nextRow, nextCol) => blockers.some(b => b.row === nextRow && b.col === nextCol);

  if (direction === "up") {
    while (
      newRow > 0 &&
      !grid[newRow][newCol].top &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow - 1, newCol)
    ) {
      newRow--;
    }

  } else if (direction === "down") {
    while (
      newRow < 15 &&
      !grid[newRow][newCol].bottom &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow + 1, newCol)
    ) {
      newRow++;
    }

  } else if (direction === "left") {
    while (
      newCol > 0 &&
      !grid[newRow][newCol].left &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow, newCol - 1)
    ) {
      newCol--;
    }

  } else if (direction === "right") {
    while (
      newCol < 15 &&
      !grid[newRow][newCol].right &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow, newCol + 1)
    ) {
      newCol++;
    }
  }

  return { row: newRow, col: newCol };
}

function getBaseForRobot() {
  switch (objetivo) {
    case 1: return basequadvermelho;
    case 2: return basequadverde;
    case 3: return basequadamarelo;
    case 4: return basequadazul;
    case 5: return basetriavermelho;
    case 6: return basetriaverde;
    case 7: return basetriaazul;
    case 8: return basetriamarelo;
    default: return basequadvermelho;
  }
}

function hasRobot(row, col, ignoreRobot) {
  return robots.some(r => r !== ignoreRobot && r.row === row && r.col === col);
  
}

// BFS no estado conjunto (vermelho + verde), permitindo usar o robô auxiliar
function bfs(targetBase) {
  const initialPositions = {
    red: { row: robotinhovermelho.row, col: robotinhovermelho.col },
    green: { row: robotinhoVerde.row, col: robotinhoVerde.col },
    yellow: { row: robotinhoAmarelo.row, col: robotinhoAmarelo.col },
    blue: { row: robotinhoAzul.row, col: robotinhoAzul.col }
  };

  const queue = [[initialPositions, []]];
  const MAX_DEPTH = 30;
  const visited = new Set();
  const robotColors = Object.keys(initialPositions);
  const initialStateKey = robotColors.map(color => `${initialPositions[color].row},${initialPositions[color].col}`).join('|');
  visited.add(initialStateKey);

  const directions = ["up", "down", "left", "right"];
  const targetRobotColor = targetBase.color;

  while (queue.length > 0) {
    const [currentPositions, path] = queue.shift();

    if (path.length > MAX_DEPTH) {
      continue;
    }

    const targetRobotCurrentPos = currentPositions[targetRobotColor];
    if (targetRobotCurrentPos.row === targetBase.row && targetRobotCurrentPos.col === targetBase.col) {
      console.log(`Base encontrada! Passos: ${path.length}`);
      return path;
    }

    for (const movingColor of robotColors) {
      for (const dir of directions) {
        const moverPos = currentPositions[movingColor];
        const blockers = robotColors
          .filter(c => c !== movingColor)
          .map(c => currentPositions[c]);

        const nextPos = slidePosition(moverPos.row, moverPos.col, dir, blockers);

        if (nextPos.row === moverPos.row && nextPos.col === moverPos.col) continue;

        const newPositions = { ...currentPositions, [movingColor]: { row: nextPos.row, col: nextPos.col } };
        const stateKey = robotColors.map(c => `${newPositions[c].row},${newPositions[c].col}`).join('|');

        if (visited.has(stateKey)) continue;

        visited.add(stateKey);
        queue.push([
          newPositions,
          [...path, { robot: movingColor, direction: dir }]
        ]);
      }
    }
  }

  console.log("Base não alcançável!");
  return null;
}

async function moveRobotByBfs(robot) {
  const targetBase = getBaseForRobot();
  console.log(`\nCalculando caminho para base retangular ${targetBase.color}...`);

  resetMoveCounter();
  isAutoCounting = true;

  const path = bfs(targetBase);
  if (!path) {
    isAutoCounting = false;
    console.log("Não foi possível encontrar caminho.");
    return false;
  }

  console.log(`Caminho encontrado com ${path.length} movimentos (incluindo robô auxiliar).`);
  for (const step of path) {
    let movingRobot;
    switch(step.robot) {
      case "red": movingRobot = robotinhovermelho; break;
      case "green": movingRobot = robotinhoVerde; break;
      case "yellow": movingRobot = robotinhoAmarelo; break;
      case "blue": movingRobot = robotinhoAzul; break;
    }
    await moveRobot(movingRobot, step.direction);
  }

  isAutoCounting = false;

  return true;
}

let activeRobot = robotinhovermelho; // Robô selecionado por padrão
let isMoving = false; // Impede múltiplos movimentos simultâneos

document.addEventListener("keydown", async (e) => {

  if (e.key === "b" || e.key === "B") {
    if (isMoving) return;
    isMoving = true;

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

export { moveRobot, bfs, activeRobot, moveRobotByBfs, resetGameState };
