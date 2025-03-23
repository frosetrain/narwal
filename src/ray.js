class Ray {
    constructor(origin, angle) {
        this.origin = origin;
        this.direction = p5.Vector.fromAngle(angle);
    }

    cast(wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.origin.x;
        const y3 = this.origin.y;
        const x4 = this.origin.x + this.direction.x;
        const y4 = this.origin.y + this.direction.y;

        // Use the formula for line-line intersection
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return; // The lines are parallel or overlapping

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t > 0 && t < 1 && u > 0) {
            const intersectionX = x1 + t * (x2 - x1);
            const intersectionY = y1 + t * (y2 - y1);
            return createVector(intersectionX, intersectionY);
        }
    }
}
