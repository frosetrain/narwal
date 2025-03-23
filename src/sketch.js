//'d' to rotate the robot clockwise
//'w' to start moving in the direction robot is facing

let robot;
let scoreButton;
let floorPlan;

function setup() {
	new Canvas(800, 600);
	robot = new Robot();
	floorPlan = new FloorPlan();
	floorPlan.createObstacles();

	scoreButton = createButton("check score");
	scoreButton.mousePressed(tabulate);
}

function draw() {
	background(100);

	robot.drawTrail();

	if (frameCount == 60 * 60 * 2) {
		createP("done!");
		noLoop();
	}
}

function tabulate() {
	let total = width * height;
	loadPixels();
	let pixelsPerSquare = pixelDensity() * pixelDensity();
	let count = 0;
	for (i = 0; i < pixels.length; i += 4) {
		if (
			pixels[i] == 255 &&
			pixels[i + 1] == 255 &&
			pixels[i + 2] == 255 &&
			pixels[i + 3] == 255
		) {
			count += 1;
		}
	}
	let score =
		str(
			round(
				(100 * count) / pixelsPerSquare / (total - floorPlan.itemsTotalSize),
				2,
			),
		) + "% of the room is clean.";
	createP(score);
}
