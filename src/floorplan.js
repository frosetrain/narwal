class FloorPlan {
    constructor() {
        this.obstacles = [];
        this.itemsTotalSize = 0;
        this.walls = [];
    }

    createObstacles() {
        for (let i = 0; i < 7; i++) {
            let x = random(width);
            let y = random(height);
            let w = random(100, 200);
            let h = random(100, 200);
            if (y - h / 2 < 100 && x + w / 2 > width - 100) {
                x = random(width - w - 100);
            }
            let obstacle = new Sprite(x, y, w, h, "none");
            obstacle.shapeColor = color(0);
            this.obstacles.push(obstacle);
            this.walls.push(new Wall(x - w / 2, y - h / 2, x + w / 2, y - h / 2));
            this.walls.push(new Wall(x - w / 2, y - h / 2, x - w / 2, y + h / 2));
            this.walls.push(new Wall(x + w / 2, y - h / 2, x + w / 2, y + h / 2));
            this.walls.push(new Wall(x - w / 2, y + h / 2, x + w / 2, y + h / 2));
            this.itemsTotalSize += w * h;
        }
        this.walls.push(new Wall(0, 0, width, 0));
        this.walls.push(new Wall(width, 0, width, height));
        this.walls.push(new Wall(width, height, 0, height));
        this.walls.push(new Wall(0, height, 0, 0));
    }
}
