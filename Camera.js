import Vect2 from "./Vect2.js";
export default class Camera {
	constructor(x, y, width, height, { tilesize, cols, rows }) {
		this.pos = new Vect2(x, y);
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		this.cols = cols;
		this.rows = rows;
		this.scrollSpeed = tilesize;
		this.xMin = 0;
		this.yMin = 0;
		this.xMax = cols;
		this.yMax = rows;
	}

	getDimensions() {
		return {
			xMin: Math.floor(this.pos.x / this.tilesize),
			xMax: Math.ceil((this.pos.x + this.width) / this.tilesize),
			yMin: Math.floor(this.pos.y / this.tilesize),
			yMax: Math.ceil((this.pos.y + this.height) / this.tilesize),
		};
	}

	follow(player) {
		this.pos.x = Math.round(player.pos.x - this.width / 2 + player.width / 2);
		this.pos.y = Math.round(player.pos.y - this.height / 2 + player.height / 2);

		let { xMin, yMin, xMax, yMax } = this.getDimensions();

		if (yMin < this.yMin) this.pos.y = this.yMin;
		if (xMin < this.xMin) this.pos.x = this.xMin;
		if (xMax > this.xMax) this.pos.x = this.cols * this.tilesize - this.width;
		if (yMax > this.yMax) this.pos.y = this.rows * this.tilesize - this.height;

		return {
			xMin,
			xMax,
			yMin,
			yMax,
		};
	}

	update(player) {
		this.follow(player);
	}
}
