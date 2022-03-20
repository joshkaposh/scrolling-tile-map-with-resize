import Vect2 from "./Vect2.js";
import Camera from "./Camera.js";
import physics from "./physics.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const keys = {};

window.addEventListener("resize", resize);

let aspectRatio = 16 / 9;
let deviceWidth = window.innerWidth;
let deviceHeight = window.innerHeight;

window.addEventListener("keydown", (e) => {
	keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
	keys[e.code] = false;
});

class GridNode {
	constructor(i, col, row, tilesize) {
		this.i = i;
		this.col = col;
		this.row = row;
		this.x = col * tilesize;
		this.y = col * tilesize;
		this.tilesize = tilesize;
	}
	draw(x, y) {
		drawRect(x, y, this.tilesize, this.tilesize, "black");
		drawText(x, y + this.tilesize, this.i);
	}
}

class GameMap {
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
		return this.grid[row * map.cols + col];
	}

	init() {
		this.grid.length = 0;

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.grid.push(new GridNode(row * map.cols + col, col, row, this.tilesize));
			}
		}
	}
}

const map = new GameMap(20, 100, 50, []);

let camera, player;

class PlayerMovement {
	constructor(pos, width, height, velocity) {
		this.pos = pos;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
	}

	_move() {
		const new_pos = this.pos.clone();

		if (keys["KeyW"] && this.pos.y - this.velocity.y >= map.yMin) {
			new_pos.subY(this.velocity);
		}

		if (keys["KeyA"] && this.pos.x - this.velocity.x >= map.xMin) {
			new_pos.subX(this.velocity);
		}

		if (keys["KeyS"] && this.pos.y + this.height + this.velocity.y <= map.yMax) {
			new_pos.addY(this.velocity);
		}

		if (keys["KeyD"] && this.pos.x + this.width + this.velocity.x <= map.xMax) {
			new_pos.addX(this.velocity);
		}

		this.pos.setVect(new_pos);
	}
}

class Player extends PlayerMovement {
	constructor(x, y, vX, vY, width, height, color) {
		super(new Vect2(x, y), width, height, new Vect2(vX, vY));
		this.color = color;
	}

	draw(camera) {
		let player_x = Math.ceil(this.pos.x - camera.pos.x + c.canvas.width * 0.5 - camera.width * 0.5);
		let player_y = Math.ceil(this.pos.y - camera.pos.y + c.canvas.height * 0.5 - camera.height * 0.5);
		// let player_x = this.pos.x;
		// let player_y = this.pos.y;

		drawRect(player_x, player_y, this.width, this.height, this.color, true);
	}

	update() {
		this._move();
	}
}

function resize() {
	deviceWidth = window.innerWidth;
	deviceHeight = window.innerHeight;

	if (deviceHeight < deviceWidth / aspectRatio) deviceWidth = deviceHeight * aspectRatio;
	else deviceHeight = deviceWidth / aspectRatio;

	canvas.width = deviceWidth;
	canvas.height = deviceHeight;

	canvas.style.width = deviceWidth + "px";
	canvas.style.height = deviceHeight + "px";

	c.imageSmoothingEnabled = false;
}

const drawRect = (x, y, width, height, color, fillBool) => {
	c.beginPath();
	c.fillStyle = color;
	c.strokeStyle = color;

	c.rect(x, y, width, height);
	fillBool ? c.fill() : c.stroke();

	c.closePath();
};

const drawText = (x, y, text) => {
	c.beginPath();
	c.fillStyle = "black";
	c.strokeStyle = "black";

	c.fillText(text, x, y);
	c.closePath();
};

function draw() {
	let { xMin, yMin, yMax, xMax } = camera.getDimensions();

	for (let y = yMin; y < yMax; y++) {
		for (let x = xMin; x < xMax; x++) {
			const cell = map.getNode(x, y);

			let tile_x = x * map.tilesize;
			let tile_y = y * map.tilesize;
			let offsetX = Math.ceil(tile_x - camera.pos.x + c.canvas.width * 0.5 - camera.width * 0.5);
			let offsetY = Math.ceil(tile_y - camera.pos.y + c.canvas.height * 0.5 - camera.height * 0.5);

			cell.draw(offsetX, offsetY);
		}
	}
	player.draw(camera);
}

function animate() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.font = "20px Arial";

	camera.follow(player);
	player.update();
	draw();

	window.requestAnimationFrame(animate);
}

function init() {
	resize();

	let cameraWidth = Math.floor(deviceWidth / 2);
	let cameraHeight = Math.floor(deviceHeight / 2);

	camera = new Camera(0, 0, cameraWidth, cameraHeight, map);
	player = new Player(0, 0, 5, 5, map.tilesize, map.tilesize, "black");

	map.init();
	animate();
}

init();
