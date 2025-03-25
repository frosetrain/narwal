class Test {
    constructor() {
        this.solidDistances = {
            "-90": 5,
            "-45": 5,
            0: 5,
            45: 5,
            90: 5,
        };
        this.pathDistances = {
            "-90": 4,
            "-45": 5,
            0: 5,
            45: 4,
            90: 5,
        };
        this.distances = structuredClone(this.solidDistances);
        for (const [key, value] of Object.entries(this.pathDistances)) {
            console.log(key, value);
            if (value < this.distances[key]) {
                console.log("ah");
                this.distances[key] = value;
            }
        }
    }
}

let test = new Test();
