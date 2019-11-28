const difficulty = new URLSearchParams(location.search).get("diff");

const difficultyFunctions = { easy: easy, medium: medium, hard: hard };

const N_ROWS = 4;

function easy() {}

function medium() {}

function hard() {}

function error() {
  alert("PLEASE, DON'T PLAY WITH THE URL.\nTHANK YOU.");
  noLoop();
}

function handleObjectsData(e, callback) {
  let request = e.target;
  try {
    let data = JSON.parse(request.response);
    callback(data[difficulty]);
  } catch (e) {
    console.error(e);
  }
}

function readObjectsData(callback) {
  let request = new XMLHttpRequest();
  request.onload = e => handleObjectsData(e, callback);
  request.open("GET", "js/objectsData.json");
  request.send();
}

// p5js
const PADDING = 40;
const ROW_PADDING = 10;
const D_LINE_WEIGHT = 4;
const D_LINE_COLOR = [0, 0, 0];
let header;

let rowsData = Array(N_ROWS);
let lines = [];
let currentLine;

let rectsToCheck = {};

let levelData;

function initRowsData() {
  for (let i = 0; i < N_ROWS; i++) {
    rowsData[i] = { x: 0, y: 0, h: 0, w: 0, object: createGraphics(0, 0) };
  }
}

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

function addRectsToCheck(x, y, size, name) {
  rectsToCheck[name] = { x, y, size };
}

function getNearestRect(x, y) {
  function isInsideRect(x, y, rx, ry, size) {
    return x >= rx && y >= ry && x <= rx + size && y <= ry + size;
  }

  for (const rectEntry of Object.entries(rectsToCheck)) {
    let rect = rectEntry[1];
    if (isInsideRect(x, y, rect.x, rect.y, rect.size))
      return [rect.x + rect.size / 2, rect.y + rect.size / 2, rectEntry[0]];
  }

  return [x, y, null];
}

function updateRowsObjects(rowsData, levelRowsDrawingData) {
  let result = [];
  let rowC = 0;

  for (const row of rowsData) {
    let current = row.object;
    current.resizeCanvas(row.w, row.h);
    current.clear();

    // Image fillers
    let rect_size = row.h - ROW_PADDING * 2;
    // left rect
    current.rect(ROW_PADDING, ROW_PADDING, rect_size, rect_size);
    // right rect
    current.rect(
      row.w - ROW_PADDING - rect_size,
      ROW_PADDING,
      rect_size,
      rect_size
    );

    current.image(
      levelRowsDrawingData[rowC][0],
      ROW_PADDING,
      ROW_PADDING,
      rect_size,
      rect_size
    );
    current.image(
      levelRowsDrawingData[rowC][1],
      row.w - ROW_PADDING - rect_size,
      ROW_PADDING,
      rect_size,
      rect_size
    );

    addRectsToCheck(ROW_PADDING, row.y + ROW_PADDING, rect_size, `l${rowC}`);
    addRectsToCheck(
      row.w - ROW_PADDING - rect_size,
      row.y + ROW_PADDING,
      rect_size,
      `r${rowC}`
    );

    row.object = current;
    rowC++;
  }
  return result;
}

function initRowsDrawingData() {
  return levelData.slice(0, N_ROWS);
}

function setup() {
  console.log(`welcome, you choose ${difficulty} difficulty`);
  (difficultyFunctions[difficulty] || error)();
  header = createDiv("welcome");
  let cvx = createCanvas(
    windowWidth - PADDING,
    windowHeight - PADDING - header.height
  );

  initRowsData();
  let counter = 0;
  readObjectsData(levelD => {
    levelD.forEach((e, i) =>
      e.forEach((ee, ii) =>
        loadImage(`images/${difficulty}/` + ee, m => {
          levelD[i][ii] = m;
          if (++counter == levelD.length * 2) levelData = levelD;
        })
      )
    );
  });
}

function touchStarted() {
  drawing = true;
  currentLine = {
    start: [mouseX, mouseY],
    end: [mouseX, mouseY],
    color: [255, 125, 0] // TODO: change to some color
  };

  let nearest = getNearestRect(mouseX, mouseY);
  currentLine.start = [nearest[0], nearest[1]];
  return false;
}

function touchMoved() {
  currentLine.end = [mouseX, mouseY];
  return false;
}

function touchEnded() {
  drawing = false;
  currentLine.end = [mouseX, mouseY];
  let nearest = getNearestRect(mouseX, mouseY);

  // only record if it is in a rect.
  if (nearest[2]) {
    // and the start also
    let inNearest = getNearestRect(currentLine.start[0], currentLine.start[1]);
    if (
      inNearest[2] && // not null
      inNearest[2] != nearest[2] && // not to itself
      nearest[2][0] != inNearest[2][0] // not to the same column
    ) {
      currentLine.end = [nearest[0], nearest[1]];
      // TODO: choose color based on state of the line (correct or not)
      // TODO: collect score here
      currentLine.color = null;
      lines.push(currentLine);
    }
  }
  currentLine = null;
  return false;
}

function drawLines() {
  push();
  strokeWeight(D_LINE_WEIGHT);
  function setColor(l) {
    if (l.color) stroke(l.color[0], l.color[1], l.color[2]);
    else stroke(D_LINE_WEIGHT[0], D_LINE_WEIGHT[1], D_LINE_WEIGHT[2]);
  }

  for (const l of lines) {
    setColor(l);
    line(l.start[0], l.start[1], l.end[0], l.end[1]);
  }

  if (currentLine) {
    setColor(currentLine);
    line(
      currentLine.start[0],
      currentLine.start[1],
      currentLine.end[0],
      currentLine.end[1]
    );
  }

  pop();
}

function draw() {
  background(200);
  resizeCanvas(windowWidth - PADDING, windowHeight - PADDING - header.height);

  // check if there is any data/images to  draw
  if (levelData) {
    updateSplitRows(height, width, rowsData);
    let levelRowsDrawingData = initRowsDrawingData();
    updateRowsObjects(rowsData, levelRowsDrawingData);

    for (const row of rowsData) {
      image(row.object, row.x, row.y, row.w, row.h);
    }

    drawLines();
  }
}