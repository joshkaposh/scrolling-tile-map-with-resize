import Vect2 from "./Vect2.js";
import Pencil from "./Pencil.js";
import TileMap from "./TileMap.js";
import Camera from "./Camera.js";
import { offsetToCenter } from "./Camera.js";
import Player from "./Player.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

window.addEventListener("resize", resize);

let aspectRatio = 16 / 9;
let deviceWidth = window.innerWidth;
let deviceHeight = window.innerHeight;

const map = new TileMap(20, 100, 50, []);
const pencil = new Pencil(c);

let camera, player;

function resize() {
	// ! little bit of resizing issues on lower width devices
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

function draw() {
	let { xMin, yMin, yMax, xMax } = camera.getDimensions();

	for (let y = yMin; y < yMax; y++) {
		for (let x = xMin; x < xMax; x++) {
			const cell = map.getNode(x, y);
			let tile_x = x * map.tilesize;
			let tile_y = y * map.tilesize;

			const offset = offsetToCenter(
				new Vect2(tile_x, tile_y),
				camera.pos,
				c.canvas.width,
				c.canvas.height,
				camera.width,
				camera.height
			);

			pencil.drawRect(offset.x, offset.y, map.tilesize, map.tilesize, false);
			pencil.drawText(offset.x, offset.y + map.tilesize, cell.i);
			// draw cell
		}
	}

	const playerOffset = offsetToCenter(
		player.pos,
		camera.pos,
		c.canvas.width,
		c.canvas.height,
		camera.width,
		camera.height
	);

	pencil.drawRect(playerOffset.x, playerOffset.y, player.width, player.height, true);
	// draw player
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
	player = new Player(0, 0, 5, 5, map.tilesize, map.tilesize, "black", {
		xMin: map.xMin,
		xMax: map.xMax,
		yMin: map.yMin,
		yMax: map.yMax,
	});

	map.init();
	animate();
}

init();
