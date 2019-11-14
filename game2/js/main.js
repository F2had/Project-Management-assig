const difficulty = new URLSearchParams(location.search).get("diff");

const difficultyFunctions = { easy: easy, medium: medium, hard: hard };

function easy() {
  console.log("ss");
}

function medium() {}

function hard() {}

function error() {
  alert("PLEASE, DON'T PLAY WITH THE URL.\nTHANK YOU.");
}

function drawPage(relations) {
  if (relations.length() != 4) {
    console.error("ERROR: in drawPage:game2");
    return;
  }
}

function splitRows(h, w) {
  let result = [];

  let newH = h / 4;
  let newW = w;

  for (let i = 0; i < 4; i++) {
    let newY = h * (i / 4);
    let newX = 0;

    result.push({ x: newX, y: newY, h: newH, w: newW });
  }
  return result;
}

function createRows(rowsDimensionsData, rowsDrawingData) {
  let result = [];
  for (const row of rowsDimensionsData) {
      let current = createGraphics(row.w, row.h);
      // draw here
      // TODO: draw

      //
      result.push({object:current, meta: row});
  }
  return result;
}

function initRowsDrawingData() {
    return null;
}


// p5js
const PADDING = 40;
let header;

function setup() {
  console.log(`welcome, you choose ${difficulty} difficulty`);
  (difficultyFunctions[difficulty] || error)();
  header = createDiv("welcome");
  let cvx = createCanvas(
    windowWidth - PADDING,
    windowHeight - PADDING - header.height
  );
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

  let rowsDimensionData = splitRows(height, width);
  let rowsDrawingData = initRowsDrawingData();
  let rows = createRows(rowsDimensionData, rowsDrawingData);


  for (const row of rows) {
      image(row.object, row.meta.x, row.meta.y, row.meta.w, row.meta.h);
  }
}
