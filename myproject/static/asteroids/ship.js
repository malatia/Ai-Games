// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/hacZU523FyM

function Ship({ game, brain }) {
  this.pos = createVector(width / 2, height / 2);
  this.r = 20;
  this.heading = 0;
  this.rotation = 0;
  this.game = game
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.attackCharged = 0
  this.chageLimit = 15
  this.dead = false
  if (brain) {
    this.brain = brain.copy()
  }
  else {
    this.brain = new Brain(19, 512, 4)
  }

  this.boosting = function (b) {
    this.isBoosting = b;
  };

  this.update = function () {
    if (!this.dead) {
      this.turn()
      if (this.isBoosting) {
        this.boost();
      }
      this.pos.add(this.vel);
      this.vel.mult(0.99);
      this.heading = this.heading % (PI * 2)
      this.think()
      if (this.attackCharged < this.chageLimit) this.attackCharged++
      this.edges();
    }
  };

  this.boost = function () {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  };

  this.hits = function (asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  };

  this.fire = function () {
    if (this.attackCharged >= this.chageLimit) {
      this.game.lasers.push(new Laser(this.pos, this.heading));
      this.attackCharged = 0
    }
  }

  this.left = function () {
    this.setRotation(0.1)
  }
  this.right = function () {
    this.setRotation(-0.1)
  }

  this.find4closest = function () {
    let dists = []
    for (let i = 0; i < this.game.asteroids.length; i++) {
      dists.push(dist(this.pos.x, this.pos.y, this.game.asteroids[i].pos.x, this.game.asteroids[i].pos.y))
    }
    dists_copy = [...dists]
    dists.sort()
    highestValue = dists[0]
    highestValue2 = dists[1]
    highestValue3 = dists[2]
    highestValue4 = dists[3]
    index1 = dists_copy.findIndex(element => element === highestValue)
    index2 = dists_copy.findIndex(element => element === highestValue2)
    index3 = dists_copy.findIndex(element => element === highestValue3)
    index4 = dists_copy.findIndex(element => element === highestValue4)
    let asteroidsReturned = [this.game.asteroids[index1], this.game.asteroids[index2], this.game.asteroids[index3], this.game.asteroids[index4]]
    return asteroidsReturned
  }


  this.think = function (other) {
    let inputs = [];
    fourClosests = this.find4closest()
    for (asteroid in fourClosests) asteroid.highlight = true
    inputs[0] = this.pos.x / canvasWidth;
    inputs[1] = this.pos.y / canvasHeight;
    inputs[2] = this.heading / (PI * 2)
    inputs[3] = fourClosests[0].pos.x
    inputs[4] = fourClosests[0].pos.y
    inputs[5] = fourClosests[1].pos.x
    inputs[6] = fourClosests[1].pos.y
    inputs[7] = fourClosests[2].pos.x
    inputs[8] = fourClosests[2].pos.y
    inputs[9] = fourClosests[3].pos.x
    inputs[10] = fourClosests[3].pos.y
    inputs[11] = fourClosests[0].vel.x
    inputs[12] = fourClosests[0].vel.y
    inputs[13] = fourClosests[1].vel.x
    inputs[14] = fourClosests[1].vel.y
    inputs[15] = fourClosests[2].vel.x
    inputs[16] = fourClosests[2].vel.y
    inputs[17] = fourClosests[3].vel.x
    inputs[18] = fourClosests[3].vel.y

    // console.log(inputs)
    let output = this.brain.predict(inputs);
    // let sorted
    // sorted = output.sort()
    // console.log("-------")
    // console.log(output)
    // console.log(sorted)
    let maxValue
    let indexMaxValue
    maxValue = Math.max.apply(null, output)
    indexMaxValue = output.indexOf(maxValue)
    switch (indexMaxValue) {
      case 0:
        this.left()
        break

      case 1:
        this.right()
        break

      case 2:
        this.boosting(true);
        break

      case 3:
        this.fire()
        break
    }
  }


  this.render = function () {
    if (!this.dead) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      fill(0);
      stroke(255);
      triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
      pop();
    }
  }

  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };

  this.setRotation = function (a) {
    this.rotation = a;
  };

  this.turn = function () {
    this.heading += this.rotation;
  };
}
