const physics = {
	rectRect: ({ pos: pos1, width: w1, height: h1 }, { pos: pos2, width: w2, height: h2 }) => {
		if (pos1.x < pos2.x + w2 && pos1.x + w1 > pos2.x && pos1.y < pos2.y + h2 && pos1.y + h1 > pos2.y) {
			return true;
		}
		return false;
	},
};

export default physics;
