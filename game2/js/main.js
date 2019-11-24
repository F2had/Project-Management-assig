const difficulty = new URLSearchParams(location.search).get("diff");

const difficultyFunctions = { easy: easy, medium: medium, hard: hard };

const N_ROWS = 4;

// initialize based on level chosen.
// TODO: use it
let levelData;

function easy() {
}

function medium() {}

function hard() {}

function error() {
  alert("PLEASE, DON'T PLAY WITH THE URL.\nTHANK YOU.");
  noLoop();
}

// p5js
const PADDING = 40;
let header;

let rowsData = Array(N_ROWS);

function updateSplitRows(h, w, oldData) {
  let newH = h / N_ROWS;
  let newW = w;

  for (let i = 0; i < N_ROWS; i++) {
    let newY = h * (i / N_ROWS);
    let newX = 0;

    oldData[i].x = newX;
    oldData[i].y = newY;
    oldData[i].h = newH;
    oldData[i].w = newW;
  }
}

function updateRowsObjects(rowsData, rowsDrawingData) {
  let result = [];
  for (const row of rowsData) {
    let current = createGraphics(row.w, row.h);
    // draw here
    // TODO: draw

    row.object = current;
  }
  return result;
}

function initRowsDrawingData() {
  // TODO: implement 
  return null;
}

function setup() {
  console.log(`welcome, you choose ${difficulty} difficulty`);
  (difficultyFunctions[difficulty] || error)();
  header = createDiv("welcome");
  let cvx = createCanvas(
    windowWidth - PADDING,
    windowHeight - PADDING - header.height
  );

  for (let i = 0; i < N_ROWS; i++) {
    rowsData[i] = {};
  }
}

function touchStarted() {
  drawing = true;
  return false;
}

function touchEnded() {
  drawing = false;
  return false;
}

function draw() {
  background(200);
  resizeCanvas(windowWidth - PADDING, windowHeight - PADDING - header.height);

  updateSplitRows(height, width, rowsData);
  let rowsDrawingData = initRowsDrawingData();
  updateRowsObjects(rowsData, rowsDrawingData);

  for (const row of rowsData) {
    image(row.object, row.x, row.y, row.w, row.h);
    row.object.remove();
  }
}
