class Game {
    constructor(doRender = false, brain = undefined) {
        this.asteroids = [];
        this.lasers = [];
        if (brain) {
            this.ship = new Ship({ game: this, brain: brain })
        }
        else {
            this.ship = new Ship({ game: this })
        }
        this.score = 0
        for (let i = 0; i < 5; i++) {
            this.asteroids.push(new Asteroid());
        }
        this.doRender = doRender
    }

    mutate(mr) {
        this.ship.brain.mutate(mr)

    }
    update() {
        if (!this.ship.dead) {
            for (var i = 0; i < this.asteroids.length; i++) {
                if (this.ship.hits(this.asteroids[i])) {
                    this.ship.dead = true
                }
                this.asteroids[i].update();
            }
            if (this.asteroids.length < 5) this.asteroids.push(new Asteroid)

            for (var i = this.lasers.length - 1; i >= 0; i--) {
                this.lasers[i].update();
                if (this.lasers[i].offscreen()) {
                    this.lasers.splice(i, 1);
                    this.score -= 10
                } else {
                    for (var j = this.asteroids.length - 1; j >= 0; j--) {
                        if (this.lasers[i].hits(this.asteroids[j])) {
                            this.score += 75
                            if (this.asteroids[j].r > 10) {
                                var newAsteroids = this.asteroids[j].breakup();
                                this.asteroids = this.asteroids.concat(newAsteroids);
                            }
                            this.asteroids.splice(j, 1);
                            this.lasers.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            this.ship.update();
            this.score++
            if (this.doRender) this.render()
        }
    }

    render() {
        this.ship.render();
        for (var i = 0; i < this.asteroids.length; i++) {
            this.asteroids[i].render();
        }
        for (var i = this.lasers.length - 1; i >= 0; i--) {
            this.lasers[i].render();
        }

    }

}