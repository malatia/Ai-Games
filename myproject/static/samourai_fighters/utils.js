function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
    rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
  player.calculateScore(enemy)
  enemy.calculateScore(player)
  savedPlayers.push(player)
  savedEnemies.push(enemy)
  fightCount++


}


function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
    if (TRAININGMODE === "ONE") {
      enemy = createEnemy()
    }
    timer = 60
  }
}


function createPlayer(brain = undefined) {
  const player = new Fighter({
    position: {
      x: 200,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: 0,
      y: 0
    },
    imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/IdleLeft.png')}}",
    framesMax: 8,
    scale: 2.5,
    offset: {
      x: 215,
      y: 157
    },
    sprites: {
      idleRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/IdleRight.png')}}",
        framesMax: 8
      },
      runRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/RunRight.png')}}",
        framesMax: 8
      },
      jumpRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/JumpRight.png')}}",
        framesMax: 2
      },
      fallRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/FallRight.png')}}",
        framesMax: 2
      },
      attackRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/AttackRight.png')}}",
        framesMax: 6
      },
      takeHitRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/Take Hit - white silhouette Right.png')}}",
        framesMax: 4
      },
      deathRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/DeathRight.png')}}",
        framesMax: 6
      },
      idleLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/IdleLeft.png')}}",
        framesMax: 8
      },
      runLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/RunLeft.png')}}",
        framesMax: 8
      },
      jumpLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/JumpLeft.png')}}",
        framesMax: 2
      },
      fallLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/FallLeft.png')}}",
        framesMax: 2
      },
      attackLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/AttackLeft.png')}}",
        framesMax: 6
      },
      takeHitLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/Take Hit - white silhouette Left.png')}}",
        framesMax: 4
      },
      deathLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/samuraiMack/DeathLeft.png')}}",
        framesMax: 6
      }
    },
    attackBox: {
      offset: {
        x: 50,
        y: 50
      },
      width: 170,
      height: 50
    },
    orientation: "right",
    brain: brain,
    mode: "IA"
  })
  return player
}

function createEnemy(brain = undefined) {


  const enemy = new Fighter({
    position: {
      x: 800,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    color: 'blue',
    offset: {
      x: -50,
      y: 0
    },
    imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/IdleLeft.png')}}",
    framesMax: 4,
    scale: 2.5,
    offset: {
      x: 215,
      y: 167
    },
    sprites: {
      idleLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/IdleLeft.png')}}",
        framesMax: 4
      },
      runLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/RunLeft.png')}}",
        framesMax: 8
      },
      jumpLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/JumpLeft.png')}}",
        framesMax: 2
      },
      fallLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/FallLeft.png')}}",
        framesMax: 2
      },
      attackLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/AttackLeft.png')}}",
        framesMax: 4
      },
      takeHitLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/Take hit Left.png')}}",
        framesMax: 3
      },
      deathLeft: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/DeathLeft.png')}}",
        framesMax: 7
      },
      idleRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/IdleRight.png')}}",
        framesMax: 4
      },
      runRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/RunRight.png')}}",
        framesMax: 8
      },
      jumpRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/JumpRight.png')}}",
        framesMax: 2
      },
      fallRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/FallRight.png')}}",
        framesMax: 2
      },
      attackRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/AttackRight.png')}}",
        framesMax: 4
      },
      takeHitRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/Take hit Right.png')}}",
        framesMax: 3
      },
      deathRight: {
        imageSrc: "{{url_for('static', filename='samourai_fighters/img/kenji/DeathRight.png')}}",
        framesMax: 7
      }
    },
    attackBox: {
      offset: {
        x: -150,
        y: 50
      },
      width: 170,
      height: 50
    },
    orientation: "left",
    brain: brain,
    mode: "player"
  })

  return enemy
}