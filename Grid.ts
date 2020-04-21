type GridArray = boolean[][];

class Grid {
  private readonly rows: number;
  private readonly cols: number;
  private currentCells: GridArray;
  private nextCells: GridArray;

  constructor(rows: number, cols: number, cells?: GridArray) {
    this.rows = rows;
    this.cols = cols;
    const afl = Grid.arrayFromLength;
    this.currentCells = cells || <GridArray> afl(rows, () => afl(cols, () => false));
  }

  get(row: number, col: number): boolean[] {
    return [this.currentCells[row][col], this.nextCells ? this.nextCells[row][col] : null];
  }

  set(row: number, col: number, value: boolean) {
    this.currentCells[row][col] = value;
  }

  advance(): void {
    const afl = Grid.arrayFromLength;
    if (this.nextCells) this.currentCells = this.nextCells;
    this.nextCells = <GridArray>afl(this.rows, (_, ri) => afl(this.cols, (_, ci) => this.isNewCellOn(ri, ci)));
  }

  private static arrayFromLength(length: number, fn) {
    return Array.from({length: length}, fn);
  }

  private isNewCellOn(row: number, col: number): boolean {
    const neighbors = this.countNeighbors(row, col);
    return this.currentCells[row][col] ? neighbors === 2 || neighbors === 3 : neighbors === 3;
  }

  private countNeighbors(row: number, col: number): number {
    let n = 0;

    const neighbors = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1],
    ];
    neighbors.forEach(([colOff, rowOff]) => {
      const neighborCol = col + colOff;
      const neighborRow = row + rowOff;
      const invalidOffsets = neighborCol < 0 || neighborRow < 0 ||
        neighborCol > this.cols - 1 || neighborRow > this.rows - 1;
      if (! invalidOffsets && this.currentCells[neighborRow][neighborCol])
        ++n;
    });

    return n;
  }
}
