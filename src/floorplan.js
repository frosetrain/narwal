class FloorPlan {
	constructor() {
		this.obstacles = [];
		this.itemsTotalSize = 0;
	}

	createObstacles() {
		let light = new Sprite(width - 50, height - 50, 100, 100);
		light.shapeColor = color(165, 42, 42);
		this.itemsTotalSize += 100 * 100;
		light.collider = "k";

		let light2 = new Sprite(width - 150, 300, 100, 100);
		light2.shapeColor = color(165, 42, 42);
		this.itemsTotalSize += 100 * 100;
		light2.mass = 100000;
		light2.collider = "k";

		this.obstacles.push(light);
		this.obstacles.push(light2);
	}
}
