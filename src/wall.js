class Wall {
    constructor(x1, y1, x2, y2, fixed = true) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
        this.fixed = fixed;
    }

    show() {
        stroke("green");
        strokeWeight(2);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}
