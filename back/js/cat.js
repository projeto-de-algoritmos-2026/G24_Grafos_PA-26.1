const grid = [];

// cria grid vazio
for (let row = 0; row < 9; row++) {
  grid[row] = [];
  for (let col = 0; col < 9; col++) {
    grid[row][col] = {
      top: false,
      bottom: false,
      left: false,
      right: false,
      center: false
    };
  }
}

// setters
function setWallTop(row, col) {
  grid[row][col].top = true;
  if (row > 0) grid[row - 1][col].bottom = true;
}

function setWallLeft(row, col) {
  grid[row][col].left = true;
  if (col > 0) grid[row][col - 1].right = true;
}

function setWallBottom(row, col) {
  grid[row][col].bottom = true;
  if (row < 8) grid[row + 1][col].top = true;
}

function setWallRight(row, col) {
  grid[row][col].right = true;
  if (col < 8) grid[row][col + 1].left = true;
}

function setCenter(row, col) {
    grid[row][col].center = true;
}

export {setWallBottom,setWallLeft,setWallRight,setWallTop,setCenter};
export {grid};
