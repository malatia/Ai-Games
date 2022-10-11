function Vehicle(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 5;
    this.maxforce = 0.5;
    this.lifeTime = 0;

    this.health = 1;

    this.dna = [];
    if (dna === undefined) {
        // Food weight
        this.dna[0] = random(-2, 2);
        // Poison weight
        this.dna[1] = random(-2, 2);
        // Food perception
        this.dna[2] = random(0, 200);
        // Poision Percepton
        this.dna[3] = random(0, 200);
    } else {
        // Mutation
        this.dna[0] = dna[0];
        if (random(1) < mr) {
            this.dna[0] += random(-0.4, 0.4);
        }
        this.dna[1] = dna[1];
        if (random(1) < mr) {
            this.dna[1] += random(-0.4, 0.4);
        }
        this.dna[2] = dna[2];
        if (random(1) < mr) {
            this.dna[2] += random(-40, 40);
        }
        this.dna[3] = dna[3];
        if (random(1) < mr) {
            this.dna[3] += random(-40, 40);
        }
    }


    this.update = function () {

        this.health -= lifeDecrease;

        this.lifeTime++;
        this.velocity.add(this.acceleration);

        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }

    this.applyForce = function (force) {

        this.acceleration.add(force);
    }

    this.cloneMe = function () {
        return new Vehicle(random(width), random(height), this.dna);
    }

    this.behaviors = function (good, bad) {
        var steerG = this.eat(good, 0.3, this.dna[2]);
        var steerB = this.eat(bad, -1, this.dna[3]);

        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }



    this.eat = function (list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(list[i]);

            if (d < this.maxspeed) {
                list.splice(i, 1);
                this.health += nutrition;
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }



        if (closest != null) {
            return this.seek(closest);
        }

        return createVector(0, 0);
    }


    this.seek = function (target) {

        var desired = p5.Vector.sub(target, this.position);


        desired.setMag(this.maxspeed);


        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);

        return steer;

    }

    this.dead = function () {
        return (this.health < 0)
    }

    this.display = function () {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);


        if (debug.checked()) {
            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[0] * 25);
            strokeWeight(2);
            ellipse(0, 0, this.dna[2] * 2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[1] * 25);
            ellipse(0, 0, this.dna[3] * 2);
        }

        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }


    this.boundaries = function () {
        var d = 25;

        var desired = null;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}
