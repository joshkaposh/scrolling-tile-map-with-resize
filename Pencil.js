export default class Pencil {
	constructor(c) {
		this.c = c;
	}

	setFill(color) {
		this.c.fillStyle = color || "black";
	}

	setStroke(color) {
		this.c.strokeStyle = color || "black";
	}

	drawRect(x, y, width, height, fillBool) {
		this.c.beginPath();
		this.c.rect(x, y, width, height);
		fillBool ? this.c.fill() : this.c.stroke();

		this.c.closePath();
	}
	drawText(x, y, text) {
		this.c.beginPath();
		this.c.fillStyle = "black";
		this.c.strokeStyle = "black";

		this.c.fillText(text, x, y);
		this.c.closePath();
	}
}
