declare const p5;

new p5(p => {
  const GENERATION_DURATION = 1000;
  const TRANSITION_FRACTION = 0.25;
  const ROWS = 18;
  const COLS = 11;
  const grid = new Grid(ROWS, COLS);
  const start = [
    "           ",
    "           ",
    "           ",
    "    xxx    ",
    "     x     ",
    "     x     ",
    "    xxx    ",
    "           ",
    "    xxx    ",
    "    xxx    ",
    "           ",
    "    xxx    ",
    "     x     ",
    "     x     ",
    "    xxx    ",
    "           ",
    "           ",
    "           ",
  ];
  let currentGenerationTime = p.millis();
  start.forEach((row: string, iRow) => {
    for (let iCol = 0; iCol < COLS; ++iCol) {
      grid.set(iRow, iCol, row[iCol] !== ' ');
    }
  });

  p.setup = () => {
    p.createCanvas(p.windowWidth - 10, p.windowHeight - 50, p.WEBGL);
  };

  p.draw = () => {
    const topMargin = 100;
    const leftMargin = 50;
    p.background('white');
    p.rotateX(p.TAU / 8);
    p.translate(-p.width / 2, -p.height / 2);
    const cellHeight = (p.height - topMargin) / ROWS;
    const cellWidth = (p.width - leftMargin) / COLS;
    const cellSize = p.min(cellHeight, cellWidth);
    const strokes = ['black', 'lightgray'];

    const generationElapsedTime = p.millis() - currentGenerationTime;
    const TRANSITION_DURATION = GENERATION_DURATION * TRANSITION_FRACTION;
    const transitionProgress = p.map(p.min(generationElapsedTime,
        TRANSITION_DURATION), 0, TRANSITION_DURATION, 0, 1);

    for (let row = 0; row < ROWS; ++row) {
      for (let col = 0; col < COLS; ++col) {
        const alive = grid.get(row, col);
        const pa = grid.getPrev(row, col);
        const prevAlive = pa === null ? alive : pa;
        const aliveIndex = alive ? 0 : 1;
        const stroke = strokes[aliveIndex];
        const transitionType = alive ? transitionProgress : 1 - transitionProgress;
        const cellFillSize = cellSize * 0.8;
        const maxAliveCellHeight = cellFillSize / 3;
        const cellHeight = alive || prevAlive ?
            maxAliveCellHeight * (alive === prevAlive ? 1 : transitionType) : 0;
        const opacity = p.map(cellHeight, 0, maxAliveCellHeight, 0, 150);
        if (stroke) p.stroke(stroke); else p.noStroke();
        p.fill(0, 0, 255, opacity);
        p.push();
        p.translate(leftMargin + col * cellSize, topMargin + row * cellSize, 0);
        p.box(cellFillSize, cellFillSize, cellHeight);
        p.pop();
      }
    }
    if (p.millis() > currentGenerationTime + GENERATION_DURATION) {
      grid.advance();
      currentGenerationTime += GENERATION_DURATION;
    }
  };

});
