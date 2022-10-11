class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        orientation,
        brain,
        mode
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.mode = mode
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.attackCharges = 100
        this.attackChargesMax = 100
        this.orientation = orientation
        this.score = 101
        this.fitness = 0
        this.lefts = 0
        this.rights = 0
        this.attacks = 0
        this.jumps = 0
        this.missedAttacks = 0
        if (mode === "IA") {
            if (brain) {
                this.brain = brain.copy()
            }
            else {
                this.brain = new Brain(5, 512, 4)
            }
        }


        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    think(other) {
        let inputs = [];
        inputs[0] = this.position.x / canvas.width;
        inputs[1] = this.position.y / canvas.height;
        // inputs[2] = (this.position.x - other.position.x) / canvas.width
        // inputs[3] = (this.position.y - other.position.y) / canvas.height
        inputs[2] = (this.position.x - other.position.x) < 0 ? 0 : 1
        inputs[3] = Math.abs((this.position.x - other.position.x)) > 170 ? 0 : 1
        inputs[4] = this.orientation === "right" ? 0 : 1
        // inputs[5] = this.health / 100
        // inputs[6] = other.health / 100
        //console.log(inputs)

        // inputs[7] = timer / 60
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
                this.jump()
                break

            case 3:
                this.attack()
                break
        }
    }

    repeatedAction() {
        let actions = []
        actions.push(this.lefts)
        actions.push(this.rights)
        actions.push(this.jumps)
        actions.push(this.attacks)
        actions.sort()
        if (actions[2] < 10) {
            return true
        }
        else {
            return false
        }
    }

    calculateScore(other) {
        //this.score = (mult * this.health + (1 - mult) * (100 - other.health)) - (5 * this.missedAttacks)
        this.score += (mult * this.health + (1 - mult) * (100 - other.health))
        // if (this.health === 100 && other.health === 100) this.score = 0
        if (this.score < 0 || this.repeatedAction()) this.score = 0

    }

    mutate(rate) {
        this.brain.mutate(rate)
    }

    dispose() {
        this.brain.dispose()
    }

    update(other) {
        if (this.mode === "IA") {
            this.think(other)
        }
        if (this.mode === "random") {
            let r = Math.floor(Math.random() * 4)
            switch (r) {
                case 0:
                    this.left()
                    break
                case 1:
                    this.right()
                    break
                case 2:
                    this.jump()
                    break
                case 3:
                    this.attack()
                    break
            }
        }
        if (this.mode === "left") {
            if (this.position.x > 210 && timer < 59) {
                this.left()
            }
        }
        if (this.attackCharges < this.attackChargesMax) this.attackCharges++

        this.draw()
        if (!this.dead) this.animateFrames()
        if (Math.abs(this.position.x - other.position.x) < 170) {
            this.score++
        }

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //draw the attack box
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }

    jump() {
        this.jumps++
        if (this.velocity.y === 0 && this.position.y > 300) {
            this.velocity.y = -20
        }
    }

    left() {
        this.lefts++
        if (this.orientation === "right") {
            this.orientation = "left"
            this.attackBox.offset.x = -150
        }
        if (this.position.x - 5 > 0) {
            this.velocity.x = -5
            this.switchSprite('runLeft')
        }
    }

    right() {
        this.rights++
        if (this.orientation === "left") {
            this.orientation = "right"
            this.attackBox.offset.x = 50
        }
        if (this.position.x + 5 + this.width < canvas.width) {
            this.velocity.x = 5
            this.switchSprite('runRight')
        }
    }

    attack() {
        this.attacks++
        if (this.attackCharges >= this.attackChargesMax) {
            if (this.orientation === "left") {
                this.switchSprite('attackLeft')
            }
            else {
                this.switchSprite('attackRight')
            }
            this.isAttacking = true
            this.attackCharges = 0
        }
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            if (this.orientation === "left") {
                this.switchSprite('deathLeft')
            }
            else {
                this.switchSprite('deathRight')
            }
        } else {
            if (this.orientation === "left") {
                this.switchSprite('takeHitLeft')
            }
            else {
                this.switchSprite('takeHitRight')
            }
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.deathLeft.image) {
            if (this.framesCurrent === this.sprites.deathLeft.framesMax - 1)
                this.dead = true
            return
        }

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attackLeft.image &&
            this.framesCurrent < this.sprites.attackLeft.framesMax - 1
        )
            return

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHitLeft.image &&
            this.framesCurrent < this.sprites.takeHitLeft.framesMax - 1
        )
            return

        if (this.image === this.sprites.deathRight.image) {
            if (this.framesCurrent === this.sprites.deathRight.framesMax - 1)
                this.dead = true
            return
        }

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attackRight.image &&
            this.framesCurrent < this.sprites.attackRight.framesMax - 1
        )
            return

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHitRight.image &&
            this.framesCurrent < this.sprites.takeHitRight.framesMax - 1
        )
            return


        switch (sprite) {
            case 'idleLeft':
                if (this.image !== this.sprites.idleLeft.image) {
                    this.image = this.sprites.idleLeft.image
                    this.framesMax = this.sprites.idleLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'runLeft':
                if (this.image !== this.sprites.runLeft.image) {
                    this.image = this.sprites.runLeft.image
                    this.framesMax = this.sprites.runLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jumpLeft':
                if (this.image !== this.sprites.jumpLeft.image) {
                    this.image = this.sprites.jumpLeft.image
                    this.framesMax = this.sprites.jumpLeft.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fallLeft':
                if (this.image !== this.sprites.fallLeft.image) {
                    this.image = this.sprites.fallLeft.image
                    this.framesMax = this.sprites.fallLeft.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attackLeft':
                if (this.image !== this.sprites.attackLeft.image) {
                    this.image = this.sprites.attackLeft.image
                    this.framesMax = this.sprites.attackLeft.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'takeHitLeft':
                if (this.image !== this.sprites.takeHitLeft.image) {
                    this.image = this.sprites.takeHitLeft.image
                    this.framesMax = this.sprites.takeHitLeft.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'deathLeft':
                if (this.image !== this.sprites.deathLeft.image) {
                    this.image = this.sprites.deathLeft.image
                    this.framesMax = this.sprites.deathLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'idleRight':
                if (this.image !== this.sprites.idleRight.image) {
                    this.image = this.sprites.idleRight.image
                    this.framesMax = this.sprites.idleRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'runRight':
                if (this.image !== this.sprites.runRight.image) {
                    this.image = this.sprites.runRight.image
                    this.framesMax = this.sprites.runRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jumpRight':
                if (this.image !== this.sprites.jumpRight.image) {
                    this.image = this.sprites.jumpRight.image
                    this.framesMax = this.sprites.jumpRight.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fallRight':
                if (this.image !== this.sprites.fallRight.image) {
                    this.image = this.sprites.fallRight.image
                    this.framesMax = this.sprites.fallRight.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attackRight':
                if (this.image !== this.sprites.attackRight.image) {
                    this.image = this.sprites.attackRight.image
                    this.framesMax = this.sprites.attackRight.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'takeHitRight':
                if (this.image !== this.sprites.takeHitRight.image) {
                    this.image = this.sprites.takeHitRight.image
                    this.framesMax = this.sprites.takeHitRight.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'deathRight':
                if (this.image !== this.sprites.deathRight.image) {
                    this.image = this.sprites.deathRight.image
                    this.framesMax = this.sprites.deathRight.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}
