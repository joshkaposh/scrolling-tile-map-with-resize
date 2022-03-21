import Vect2 from "./Vect2.js";
import Pencil from "./Pencil.js";
import { offsetToCenter } from "./Camera.js";

const keys = {};

class PlayerMovement {
	constructor(pos, width, height, velocity, { xMin, xMax, yMin, yMax }) {
		this.pos = pos;
		this.velocity = velocity;
		this.width = width;
		this.height = height;

		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		window.addEventListener("keydown", (e) => {
			keys[e.code] = true;
		});
		window.addEventListener("keyup", (e) => {
			keys[e.code] = false;
		});
	}

	_move() {
		const new_pos = this.pos.clone();

		if (keys["KeyW"] && this.pos.y - this.velocity.y >= this.yMin) {
			new_pos.subY(this.velocity);
		}

		if (keys["KeyA"] && this.pos.x - this.velocity.x >= this.xMin) {
			new_pos.subX(this.velocity);
		}

		if (keys["KeyS"] && this.pos.y + this.height + this.velocity.y <= this.yMax) {
			new_pos.addY(this.velocity);
		}

		if (keys["KeyD"] && this.pos.x + this.width + this.velocity.x <= this.xMax) {
			new_pos.addX(this.velocity);
		}

		this.pos.setVect(new_pos);
	}
}

export default class Player extends PlayerMovement {
	constructor(x, y, vX, vY, width, height, color, boundaries) {
		super(new Vect2(x, y), width, height, new Vect2(vX, vY), boundaries);
		this.color = color;
	}

	draw(pencil, camera) {
		let offset = offsetToCenter(this.pos, camera.pos, this.xMax, this.yMax, camera.width, camera.height);

		pencil.drawRect(offset.x, offset.y, this.width, this.height, true);
	}

	update() {
		this._move();
	}
}
