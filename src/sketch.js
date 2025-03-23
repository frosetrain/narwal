//'d' to rotate the robot clockwise
//'w' to start moving in the direction robot is facing

let robot;
let scoreButton;
let floorPlan;

function setup() {
    angleMode(RADIANS);
    new Canvas(800, 600);
    robot = new Robot();
    floorPlan = new FloorPlan();
    floorPlan.createObstacles();
}

function draw() {
    background(100);

    robot.show();
    robot.look(floorPlan.walls);

    // if (frameCount == 60 * 60 * 2) {
    // createP("done!");
    // noLoop();
    // }

    text(floor(frameCount / 60), 10, 10);
}
