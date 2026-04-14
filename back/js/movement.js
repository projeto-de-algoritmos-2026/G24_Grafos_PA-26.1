import { grid } from "./cat.js";
import {
  robotinhovermelho,
  robotinhoVerde,
  robotinhoAmarelo,
  robotinhoAzul,
  basequadverde,
  basequadvermelho,
  basetriaverde,
  basetriavermelho,
  basequadamarelo,
  basetriaazul,
  basequadazul,
  basetriamarelo
} from "./entities.js";
import { objetivo } from "./main.js";

const robots = [robotinhovermelho, robotinhoVerde, robotinhoAmarelo, robotinhoAzul];

let isAutoCounting = false;
let autoMoveCount = 0;
const moveCounterValueElement = document.getElementById("move-counter-value");
const STEP_DURATION_MS = 120;

const initialRobotState = {
  red: { row: robotinhovermelho.row, col: robotinhovermelho.col },
  green: { row: robotinhoVerde.row, col: robotinhoVerde.col },
  yellow: { row: robotinhoAmarelo.row, col: robotinhoAmarelo.col },
  blue: { row: robotinhoAzul.row, col: robotinhoAzul.col }
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

function getSlidePath(row, col, direction, blockers = []) {
  let newRow = row;
  let newCol = col;
  const path = [];

  const isBlocked = (nextRow, nextCol) => blockers.some(b => b.row === nextRow && b.col === nextCol);

  if (direction === "up") {
    while (
      newRow > 0 &&
      !grid[newRow][newCol].top &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow - 1, newCol)
    ) {
      newRow--;
      path.push({ row: newRow, col: newCol });
    }
  } else if (direction === "down") {
    while (
      newRow < 15 &&
      !grid[newRow][newCol].bottom &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow + 1, newCol)
    ) {
      newRow++;
      path.push({ row: newRow, col: newCol });
    }
  } else if (direction === "left") {
    while (
      newCol > 0 &&
      !grid[newRow][newCol].left &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow, newCol - 1)
    ) {
      newCol--;
      path.push({ row: newRow, col: newCol });
    }
  } else if (direction === "right") {
    while (
      newCol < 15 &&
      !grid[newRow][newCol].right &&
      !((newRow === 7 || newRow === 8) && (newCol === 7 || newCol === 8)) &&
      !isBlocked(newRow, newCol + 1)
    ) {
      newCol++;
      path.push({ row: newRow, col: newCol });
    }
  }

  return path;
}

// Função para mover o robô (desliza até encostar numa barreira)
async function moveRobot(robot, direction) {
  if (!Number.isFinite(robot.renderRow) || !Number.isFinite(robot.renderCol)) {
    robot.renderRow = robot.row;
    robot.renderCol = robot.col;
  }

  const blockers = robots
    .filter(r => r !== robot)
    .map(r => ({ row: r.row, col: r.col }));

  const path = getSlidePath(robot.row, robot.col, direction, blockers);
  const moved = path.length > 0;

  for (const step of path) {
    const fromRow = robot.row;
    const fromCol = robot.col;
    robot.row = step.row;
    robot.col = step.col;
    await animateRobotToCell(robot, fromRow, fromCol, robot.row, robot.col);
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

// objetivo da main
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

// BFS no estado conjunto, permitindo usar robôs auxiliares
function bfs(targetBase) {
  const initialPositions = {
    red: { row: robotinhovermelho.row, col: robotinhovermelho.col },
    green: { row: robotinhoVerde.row, col: robotinhoVerde.col },
    yellow: { row: robotinhoAmarelo.row, col: robotinhoAmarelo.col },
    blue: { row: robotinhoAzul.row, col: robotinhoAzul.col }
  };

  const queue = [[initialPositions, []]];
  const visited = new Set();
  const MAX_DEPTH = 30;
  const robotColors = Object.keys(initialPositions);
  const initialStateKey = robotColors
    .map(color => `${initialPositions[color].row},${initialPositions[color].col}`)
    .join("|");

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
          .filter(color => color !== movingColor)
          .map(color => currentPositions[color]);

        const slidePath = getSlidePath(moverPos.row, moverPos.col, dir, blockers);
        const nextPos = slidePath.length === 0
          ? { row: moverPos.row, col: moverPos.col }
          : slidePath[slidePath.length - 1];

        if (nextPos.row === moverPos.row && nextPos.col === moverPos.col) {
          continue;
        }

        const newPositions = {
          ...currentPositions,
          [movingColor]: { row: nextPos.row, col: nextPos.col }
        };

        const stateKey = robotColors
          .map(color => `${newPositions[color].row},${newPositions[color].col}`)
          .join("|");

        if (visited.has(stateKey)) {
          continue;
        }

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
  console.log(`\nCalculando caminho para base ${targetBase.color}...`);

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
    switch (step.robot) {
      case "red": movingRobot = robotinhovermelho; break;
      case "green": movingRobot = robotinhoVerde; break;
      case "yellow": movingRobot = robotinhoAmarelo; break;
      case "blue": movingRobot = robotinhoAzul; break;
      default: continue;
    }

    await moveRobot(movingRobot, step.direction);
  }

  isAutoCounting = false;
  return true;
}

let activeRobot = robotinhovermelho;
let isMoving = false;

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
