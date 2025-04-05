class FloorPlan {
    constructor() {
        this.obstacles = [];
        this.itemsTotalSize = 0;
        this.walls = [];
    }

    addObstacle(x, y, w, h) {
        const obstacle = new Sprite(x, y, w, h, "none");
        obstacle.shapeColor = color(0);
        this.obstacles.push(obstacle);
        this.walls.push(new Wall(x - w / 2, y - h / 2, x + w / 2, y - h / 2));
        this.walls.push(new Wall(x - w / 2, y - h / 2, x - w / 2, y + h / 2));
        this.walls.push(new Wall(x + w / 2, y - h / 2, x + w / 2, y + h / 2));
        this.walls.push(new Wall(x - w / 2, y + h / 2, x + w / 2, y + h / 2));
        this.itemsTotalSize += w * h;
    }

    createObstacles() {
        for (let i = 0; i < 5; i++) {
            let x = random(width);
            let y = random(height);
            let w = random(100, 220);
            let h = random(100, 220);
            if (y - h / 2 < 100 && x + w / 2 > width - 150) {
                x = random(width - w - 150);
            }
            this.addObstacle(x, y, w, h);
        }
        // this.addObstacle(300, 300, 100, 600);
        // this.addObstacle(600, 100, 50, 200);
        // this.addObstacle(700, 300, 200, 50);
        this.walls.push(new Wall(0, 0, width, 0));
        this.walls.push(new Wall(width, 0, width, height));
        this.walls.push(new Wall(width, height, 0, height));
        this.walls.push(new Wall(0, height, 0, 0));
    }
}
