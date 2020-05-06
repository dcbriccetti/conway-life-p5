declare const p5;

new p5(p => {
  const GENERATION_DURATION = 2000;
  const TRANSITION_FRACTION = 0.5;
  const TRANSITION_DURATION = GENERATION_DURATION * TRANSITION_FRACTION;
  const MAX_CELL_OPACITY = 150;
  const ROWS = 18;
  const COLS = 17;
  const TOP_MARGIN = 0;
  const LEFT_MARGIN = 0;
  let cellSize;
  let xOffset
  let yOffset
  let currentGenerationTime = p.millis();
  const grid = new Grid(ROWS, COLS);

  setGridInitialState();

  p.setup = () => {
    p.createCanvas(p.windowWidth - 10, p.windowHeight - 50, p.WEBGL);
    const cellHeight = (p.height - TOP_MARGIN ) / ROWS;
    const cellWidth  = (p.width  - LEFT_MARGIN) / COLS;
    cellSize = p.min(cellHeight, cellWidth);
    xOffset = -cellSize * COLS / 2
    const tiltYCompensation = 100; // When we tilt it leaves space at top
    yOffset = -cellSize * ROWS / 2 - tiltYCompensation
  };

  p.draw = () => {
    p.background('white');
    p.rotateX(p.TAU / 8);
    const frameDrawTime = p.millis();
    const generationElapsedTime = frameDrawTime - currentGenerationTime;
    const transitionProgress = p.map(p.min(generationElapsedTime,
        TRANSITION_DURATION), 0, TRANSITION_DURATION, 0, 1);

    for (let row = 0; row < ROWS; ++row) {
      for (let col = 0; col < COLS; ++col) {
        const alive = grid.get(row, col);
        const pa = grid.getPrev(row, col);
        const prevAlive = pa === null ? alive : pa;
        const transitionMultiplier = alive ? transitionProgress : 1 - transitionProgress;
        const cellFillSize = cellSize * 0.8;
        const maxAliveCellHeight = cellFillSize / 3;
        const sameState = alive === prevAlive;
        const cellHeight = alive || prevAlive ?
            maxAliveCellHeight * (sameState ? 1 : transitionMultiplier) : 0;
        const opacity = p.map(cellHeight, 0, maxAliveCellHeight, 0, MAX_CELL_OPACITY);
        p.stroke(alive ? 'black' : 'lightgray')
        p.fill(0, 0, 255, opacity);
        p.push();
        p.translate(xOffset + col * cellSize, yOffset + row * cellSize, cellHeight / 2);
        p.box(cellFillSize, cellFillSize, cellHeight);
        p.pop();
      }
    }
    if (frameDrawTime > currentGenerationTime + GENERATION_DURATION) {
      grid.advance();
      currentGenerationTime = frameDrawTime;
    }
  };

  p.mouseClicked = () => { // Will be used to toggle cell states
    const mx = p.mouseX - p.width / 2
    const my = p.mouseY - p.height / 2
    const rowIndex = Math.floor((my + cellSize / 2) / cellSize)
    const colIndex = Math.floor((mx + cellSize / 2) / cellSize)
  }

  function setGridInitialState() {
    const start = [
      "                 ",
      "                 ",
      "                 ",
      "    xxx          ",
      "     x       xx  ",
      "     x       xx  ",
      "    xxx        xx",
      "               xx",
      "    xxx          ",
      "    xxx          ",
      "                 ",
      "    xxx      xxx ",
      "     x      xxx  ",
      "     x           ",
      "    xxx          ",
      "               x ",
      "               x ",
      "               x ",
    ];
    start.forEach((row: string, iRow) => {
      for (let iCol = 0; iCol < COLS; ++iCol) {
        grid.set(iRow, iCol, row[iCol] !== ' ');
      }
    });
  }
});
