class Robot {
    constructor() {
        this.sprite = new Sprite(width, 30);
        this.sprite.rotation = PI;
        this.r = 25;
        this.maxSpeed = 2;
        this.sprite.vel = createVector(cos(this.sprite.rotation), sin(this.sprite.rotation)).setMag(
            this.maxSpeed,
        );
        this.sprite.collider = "k";
        this.trail = [];
        this.right = true;
        this.zigzag = false;
        this.rays = {
            "-90": new Ray(this.sprite.pos, this.sprite.rotation - PI / 2),
            "-45": new Ray(this.sprite.pos, this.sprite.rotation - PI / 4),
            0: new Ray(this.sprite.pos, this.sprite.rotation),
            45: new Ray(this.sprite.pos, this.sprite.rotation + PI / 4),
            90: new Ray(this.sprite.pos, this.sprite.rotation + PI / 2),
        };
        this.pathDistances = {};
        this.solidDistances = {};
        this.state = "forward";
        this.frameCounter = 0;
        this.backtracking = false;
        this.pTrailLeft = {
            x: this.sprite.x,
            y: this.sprite.y + 25,
        };
        this.pTrailRight = {
            x: this.sprite.x,
            y: this.sprite.y - 25,
        };
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
                case "uturn":
                    fill("#d946ef");
                    break;
            }
            circle(0, 0, this.r * 2 - 10);
            fill(0);
            rectMode(CENTER);
            rect(15, 0, 3, 30);
            fill("black");
            text(this.right, 0, 0);
        };

        this.sprite.update = () => {
            this.insideMap();
            this.distances = structuredClone(this.solidDistances);
            if (this.zigzag) {
                // Ensure distances reflect the closest obstacle
                for (const [key, value] of Object.entries(this.pathDistances)) {
                    this.distances[key] = Math.min(this.distances[key], value);
                }
            }

            // Hug the right wall and go forward
            if (this.state === "forward") {
                // Update sprite velocity
                this.sprite.vel = createVector(
                    cos(this.sprite.rotation),
                    sin(this.sprite.rotation),
                ).setMag(this.maxSpeed);

                // Align to the correct side based on robot direction
                if (this.zigzag && !this.backtracking) {
                    this.right = this.sprite.rotation < 0;
                }

                // Check for wall in front, u-turn if zigzagging, otherwise turn left
                if (
                    (this.backtracking && this.solidDistances["0"] < 50) ||
                    (!this.backtracking && this.distances["0"] < 35 && this.distances["0"] >= 25)
                ) {
                    if (this.zigzag) {
                        // Hit a wall, do something
                        console.log("WALL");
                        this.backtracking = false;
                        this.frameCounter = 0;
                        this.turnRight = this.sprite.rotation > 0;
                        if (
                            this.distances["-90"] < 75 &&
                            this.distances["-90"] >= 25 &&
                            this.distances["90"] < 75 &&
                            this.distances["90"] >= 25
                        ) {
                            // Stuck, start backtracking
                            console.log("stucc");
                            this.state = "stuck";
                            this.backtracking = true;
                            this.right = !this.right;
                        } else {
                            if (this.distances["-90"] > 75 && this.distances["90"] <= 75) {
                                // Left side open
                                console.log("left open");
                                this.turnRight = false;
                            } else if (this.distances["90"] > 75 && this.distances["-90"] <= 75) {
                                // Right side open
                                console.log("right open");
                                this.turnRight = true;
                            } else {
                                // Both sides open, turn to the non-hugging side
                                this.turnRight = !this.right;
                            }
                            // Turn around because yes
                            this.state = "uturn";
                        }
                    } else {
                        // In first layer, turn left
                        this.state = "wall";
                        this.sprite.speed = 0;
                        console.log("wall");
                    }
                }

                // We are in a corridor that is too narrow, turn around
                if (this.solidDistances["-45"] < 30 && this.solidDistances["45"] < 50) {
                    this.state = "stuck";
                    this.frameCounter = 0;
                    console.log("stuck");
                }

                // Hug the right wall
                let error45 = this.distances[this.right ? "45" : "-45"] - 42.426 || 0;
                let error90 = this.distances[this.right ? "90" : "-90"] - 30 || 0;
                if (!this.right) {
                    error45 *= -1;
                    error90 *= -1;
                }
                if (this.zigzag) {
                    // Align only using 45 in zigzag mode to avoid getting stuck
                    this.rotate(0.003 * error45);
                } else {
                    // Align using both to avoid cutting corners
                    this.rotate(0.007 * min(error45, error90));
                }
            } else if (this.state === "stuck") {
                if (this.frameCounter < 60) {
                    // Rotate in place
                    this.sprite.speed = 0;
                    this.rotate(-PI / 60);
                } else if (this.frameCounter < 80 && this.zigzag) {
                    // Go forward slightly
                    this.sprite.speed = this.maxSpeed;
                    this.sprite.vel = createVector(
                        cos(this.sprite.rotation),
                        sin(this.sprite.rotation),
                    ).setMag(this.sprite.speed);
                } else {
                    console.log("unstuck");
                    this.state = "forward";
                }
                this.frameCounter++;
            } else if (this.state === "wall") {
                // Turn until front is clear
                this.sprite.speed = 0;
                this.rotate(-PI / 60);
                if (this.distances["0"] > 80) {
                    this.state = "forward";
                    console.log("forward");
                }
            } else if (this.state === "uturn") {
                // U-turn
                if (this.frameCounter < 30 || (this.frameCounter >= 55 && this.frameCounter < 85)) {
                    // Turn in place at the start and end
                    this.sprite.speed = 0;
                    this.rotate(this.turnRight ? PI / 60 : -PI / 60);
                } else {
                    // Move forward a bit between turns
                    this.sprite.speed = this.maxSpeed;
                    this.sprite.vel = createVector(
                        cos(this.sprite.rotation),
                        sin(this.sprite.rotation),
                    ).setMag(this.sprite.speed);
                }
                if (this.frameCounter >= 100) {
                    this.state = "forward";
                }
                this.frameCounter++;
            }
            if (
                !this.zigzag &&
                this.sprite.x > width - 40 &&
                this.sprite.y > 40 &&
                this.sprite.y < 100
            ) {
                // Finished with first layer and returned to start
                console.log("Switching to zigzag mode");
                this.zigzag = true;
            }

            if (frameCount % 5 === 0) {
                this.trail.push({ x: this.sprite.x, y: this.sprite.y });
            }
            if (frameCount % 15 === 0) {
                // Add past path to walls
                const leftEdge = createVector(1, 1);
                leftEdge.setHeading(this.sprite.rotation - HALF_PI);
                leftEdge.setMag(20);
                const rightEdge = createVector(1, 1);
                rightEdge.setHeading(this.sprite.rotation + HALF_PI);
                rightEdge.setMag(20);
                if (this.pTrailLeft && this.pTrailRight) {
                    // Create walls and push them
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
        for (const [_, ray] of Object.entries(this.rays)) {
            ray.direction.rotate(angle);
        }
    }

    insideMap() {
        // Keep the robot inside the map
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
        for (const trail of this.trail) {
            noStroke();
            fill(255);
            circle(trail.x, trail.y, this.r * 2);
        }
    }

    look(walls) {
        // Raycasting
        for (const [angle, ray] of Object.entries(this.rays)) {
            let pathClosest = p5.Vector.add(this.sprite.pos, p5.Vector.setMag(ray.direction, 100));
            let solidClosest = p5.Vector.add(this.sprite.pos, p5.Vector.setMag(ray.direction, 100));
            let pathRecord = 100; // Past paths
            let solidRecord = 100; // Actual walls
            for (const wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.sprite.pos, pt);
                    if (wall.fixed && d < solidRecord) {
                        solidClosest = pt;
                        solidRecord = d;
                    } else if (!wall.fixed && d < pathRecord) {
                        pathClosest = pt;
                        pathRecord = d;
                    }
                }
                stroke("#0f0");
                strokeWeight(2);
                line(wall.a.x, wall.a.y, wall.b.x, wall.b.y);
            }

            // Draw rays
            strokeWeight(2);
            stroke("blue");
            line(ray.origin.x, ray.origin.y, pathClosest.x, pathClosest.y);
            line(ray.origin.x, ray.origin.y, solidClosest.x, solidClosest.y);
            strokeWeight(0);
            fill("red");
            // Draw intersections
            if (pathRecord < 100) {
                circle(pathClosest.x, pathClosest.y, 8);
            }
            fill("purple");
            if (solidRecord < 100) {
                circle(solidClosest.x, solidClosest.y, 8);
            }
            this.pathDistances[angle] = pathRecord;
            this.solidDistances[angle] = solidRecord;
        }
    }
}
