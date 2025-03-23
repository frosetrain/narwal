class Robot {
    constructor() {
        this.sprite = new Sprite(width, 30);
        this.sprite.rotation = PI;
        this.speed = 2;

        this.r = 25;
        this.sprite.vel = createVector(cos(this.sprite.rotation), sin(this.sprite.rotation)).setMag(
            this.speed,
        );
        this.sprite.collider = "k";
        this.maxSpeed = 1.5;
        this.trail = [];

        this.rays = {
            "-90": new Ray(this.sprite.pos, this.sprite.rotation - PI / 2),
            "-45": new Ray(this.sprite.pos, this.sprite.rotation - PI / 4),
            0: new Ray(this.sprite.pos, this.sprite.rotation),
            45: new Ray(this.sprite.pos, this.sprite.rotation + PI / 4),
            90: new Ray(this.sprite.pos, this.sprite.rotation + PI / 2),
        };
        this.distances = {};
        this.solidDistances = {};

        this.state = "forward";
        this.stuckCount = 0;
        this.pTrailLeft = {
            x: this.sprite.x,
            y: this.sprite.y + 25,
        };
        this.pTrailRight = {
            x: this.sprite.x,
            y: this.sprite.y - 25,
        };

        this.changeSide = createButton("change side");
        this.changeSide.mousePressed(() => {
            this.right = !this.right;
        });
        this.right = true;

        this.sprite.draw = () => {
            fill(0);
            circle(0, 0, this.r * 2);
            noStroke();
            switch (this.state) {
                case "forward":
                    fill("#22c55e");
                    break;
                case "stuck":
                    fill("#ef4444");
                    break;
                case "wall":
                    fill("#eab308");
                    break;
            }
            circle(0, 0, this.r * 2 - 10);
            fill(0);
            rectMode(CENTER);
            rect(15, 0, 3, 30);
        };

        this.sprite.update = () => {
            this.insideMap();

            if (this.state === "forward") {
                this.sprite.vel = createVector(
                    cos(this.sprite.rotation),
                    sin(this.sprite.rotation),
                ).setMag(this.speed);
                if (this.solidDistances["0"] < 30) {
                    this.state = "wall";
                    this.sprite.speed = 0;
                    console.log("wall");
                }
                if (this.solidDistances["-45"] < 30 && this.solidDistances["45"] < 50) {
                    // squeezed
                    this.state = "stuck";
                    this.stuckCount = 0;
                    console.log("stuck");
                }
                let error45 = this.distances[this.right ? "45" : "-45"] - 42.426 || 0;
                let error90 = this.distances[this.right ? "90" : "-90"] - 30 || 0;
                this.rotate(0.005 * min(error45, error90));
                // this.rotate(0.005 * error45);
            } else if (this.state === "stuck") {
                this.sprite.speed = 0;
                this.rotate(-PI / 60);
                this.stuckCount++;
                if (this.stuckCount > 60) {
                    console.log("unstuck");
                    this.state = "forward";
                }
            } else if (this.state === "wall") {
                this.sprite.speed = 0;
                this.rotate(-PI / 60);
                if (this.distances["0"] > 80) {
                    this.state = "forward";
                    console.log("forward");
                }
            }

            if (frameCount % 5 === 0) {
                this.trail.push({ x: this.sprite.x, y: this.sprite.y });
            }
            if (frameCount % 15 === 0) {
                let leftEdge = createVector(1, 1);
                leftEdge.setHeading(this.sprite.rotation - HALF_PI);
                leftEdge.setMag(25);
                let rightEdge = createVector(1, 1);
                rightEdge.setHeading(this.sprite.rotation + HALF_PI);
                rightEdge.setMag(25);
                if (this.pTrailLeft && this.pTrailRight) {
                    floorPlan.walls.push(
                        new Wall(
                            this.pTrailLeft.x,
                            this.pTrailLeft.y,
                            this.sprite.x + leftEdge.x,
                            this.sprite.y + leftEdge.y,
                            false,
                        ),
                    );
                    floorPlan.walls.push(
                        new Wall(
                            this.pTrailRight.x,
                            this.pTrailRight.y,
                            this.sprite.x + rightEdge.x,
                            this.sprite.y + rightEdge.y,
                            false,
                        ),
                    );
                }
                this.pTrailLeft = {
                    x: this.sprite.x + leftEdge.x,
                    y: this.sprite.y + leftEdge.y,
                };
                this.pTrailRight = {
                    x: this.sprite.x + rightEdge.x,
                    y: this.sprite.y + rightEdge.y,
                };
            }
        };
    }

    rotate(angle) {
        this.sprite.rotation += angle;
        this.sprite.vel.rotate(angle);
        for (let [_, ray] of Object.entries(this.rays)) {
            ray.direction.rotate(angle);
        }
    }

    insideMap() {
        if (this.sprite.x > width - this.r) {
            this.sprite.x = width - this.r;
        }
        if (this.sprite.x < this.r) {
            this.sprite.x = this.r;
        }
        if (this.sprite.y > height - this.r) {
            this.sprite.y = height - this.r;
        }
        if (this.sprite.y < this.r) {
            this.sprite.y = this.r;
        }
    }

    show() {
        for (let trail of this.trail) {
            noStroke();
            fill(255);
            circle(trail.x, trail.y, this.r * 2 - 10);
        }
    }

    look(walls) {
        for (let [angle, ray] of Object.entries(this.rays)) {
            let overallClosest = p5.Vector.add(
                this.sprite.pos,
                p5.Vector.setMag(ray.direction, 100),
            );
            let solidClosest = p5.Vector.add(this.sprite.pos, p5.Vector.setMag(ray.direction, 100));
            let overallRecord = 100;
            let solidRecord = 100;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.sprite.pos, pt);
                    if (d < overallRecord) {
                        if (!wall.fixed && d < 25) {
                            break;
                        }
                        overallClosest = pt;
                        overallRecord = d;
                    }
                    if (wall.fixed && d < solidRecord) {
                        solidClosest = pt;
                        solidRecord = d;
                    }
                }
                stroke("#0f0");
                strokeWeight(4);
                line(wall.a.x, wall.a.y, wall.b.x, wall.b.y);
            }

            if (overallClosest) {
                strokeWeight(2);
                stroke("blue");
                line(ray.origin.x, ray.origin.y, overallClosest.x, overallClosest.y);
                strokeWeight(0);
                fill("red");
                if (overallRecord < 100) {
                    circle(overallClosest.x, overallClosest.y, 8);
                }
            }
            if (solidClosest) {
                strokeWeight(0);
                fill("purple");
                if (solidRecord < 100) {
                    circle(solidClosest.x, solidClosest.y, 8);
                }
            }
            this.distances[angle] = overallRecord;
            this.solidDistances[angle] = solidRecord;
        }
    }
}
