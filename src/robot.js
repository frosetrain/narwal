class Robot {
	constructor() {
		this.sprite = new Sprite();

		this.r = 25;
		this.sprite.vel = createVector(0, 0);
		this.sprite.collider = "k";
		this.maxSpeed = 1.5;
		this.trail = [];

		this.sprite.draw = () => {
			fill(0);
			circle(0, 0, this.r * 2);
			noStroke();
			fill("lightblue");
			circle(0, 0, this.r * 2 - 10);
			fill(0);
			rectMode(CENTER);
			rect(15, 0, 3, 30);
		};

		this.sprite.update = () => {
			this.insideMap();

			if (frameCount % 5 == 0) {
				this.trail.push({ x: this.sprite.x, y: this.sprite.y });
			}

			//your code here
			if (keyIsPressed && key == "d") {
				this.sprite.rotate(1);
				let r = this.sprite.rotation;
				this.sprite.vel = createVector(cos(r), sin(r));
			}

			if (keyIsPressed && key == "w") {
				let r = this.sprite.rotation;
				this.sprite.vel = createVector(cos(r), sin(r));
			}
		};
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

	drawTrail() {
		for (let trail of this.trail) {
			noStroke();
			fill(255);
			circle(trail.x, trail.y, this.r * 2 - 10);
		}
	}
}
