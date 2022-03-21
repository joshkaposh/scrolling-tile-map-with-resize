class GridNode {
	constructor(i, col, row, tilesize) {
		this.i = i;
		this.col = col;
		this.row = row;
		this.x = col * tilesize;
		this.y = col * tilesize;
		this.tilesize = tilesize;
	}
}

export default class GameMap {
	constructor(cols, rows, tilesize, grid) {
		this.cols = cols;
		this.rows = rows;
		this.tilesize = tilesize;
		this.xMin = 0;
		this.yMin = 0;
		this.xMax = cols * tilesize;
		this.yMax = rows * tilesize;
		this.grid = grid;
	}

	getNode(col, row) {
		return this.grid[row * this.cols + col];
	}

	init() {
		this.grid.length = 0;

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				let index = row * this.cols + col;
				this.grid.push(new GridNode(index, col, row, this.tilesize));
			}
		}
	}
}
