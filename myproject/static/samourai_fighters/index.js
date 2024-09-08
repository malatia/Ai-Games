const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const TOTAL = 10
let mutationRate = 0.1
let generation = 1
let mult = 0.3
let TRAININGMODE = "ONE"
let baseModel1 = undefined
let baseModel2 = undefined
let weightsBaseModel1 = undefined
let weightsBaseModel2 = undefined

canvas.width = 1024
canvas.height = 576
const uploadJSONInput = document.getElementById('upload-json');
const uploadWeightsInput = document.getElementById('upload-weights');
const uploadJSONInput2 = document.getElementById('upload-json2');
const uploadWeightsInput2 = document.getElementById('upload-weights2');
let scores = { game_name: "samourai_fighters", generations: [] }

loadModelButton = document.getElementById("loadModel")
loadModelButton.addEventListener("click", loadModel)

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
let timer = 60
let timerId
let gameSpeed = 30
let fightCount = 0

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: "{{url_for('static', filename='./img/background.png'}}"
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: "{{url_for('static', filename='./img/shop.png'}}",
  scale: 2.75,
  framesMax: 6
})

let players = []
let enemies = []

for (let i = 0; i < TOTAL; i++) {
  players[i] = createPlayer()
  if (TRAININGMODE === "TWO") enemies[i] = createEnemy()
}

let savedPlayers = []
let savedEnemies = []

let player
let enemy

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

for (let i = 0; i < gameSpeed; i++) {

  decreaseTimer()
  if (TRAININGMODE === "TWO") {
    enemy = enemies[fightCount]
  }
  else if (TRAININGMODE === "ONE") {
    enemy = createEnemy()
  }

  function animate() {
    window.requestAnimationFrame(animate)
    if (fightCount >= TOTAL - 1) {
      fightCount = 0
      nextGeneration()
    }
    document.querySelector("#fightCount").innerHTML = "Fight Count" + fightCount
    document.querySelector("#generation").innerHTML = "Generation" + generation
    document.querySelector("#total").innerHTML = "total" + TOTAL
    player = players[fightCount]

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update(enemy)
    enemy.update(player)

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
      player.left()
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.right()
    } else {
      if (player.orientation === "left") {
        player.switchSprite('idleLeft')
      }
      else {
        player.switchSprite('idleRight')
      }
    }

    // jumping
    if (player.velocity.y < 0) {
      if (player.orientation === "left") {
        player.switchSprite('jumpLeft')
      }
      else {
        player.switchSprite('jumpRight')
      }
    } else if (player.velocity.y > 0) {
      if (player.orientation === "left") {
        player.switchSprite('fallLeft')
      }
      else {
        player.switchSprite('fallRight')
      }
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.left()
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.right()
    } else {
      if (enemy.orientation === "left") {
        enemy.switchSprite('idleLeft')
      }
      else {
        enemy.switchSprite('idleRight')
      }
    }

    // jumping
    if (enemy.velocity.y < 0) {
      if (enemy.orientation === "left") {
        enemy.switchSprite('jumpLeft')
      }
      else {
        enemy.switchSprite('jumpRight')
      }
    } else if (enemy.velocity.y > 0) {
      if (enemy.orientation === "left") {
        enemy.switchSprite('fallLeft')
      }
      else {
        enemy.switchSprite('fallRight')
      }
    }

    // detect for collision & enemy gets hit
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false
    }
    else if (
      !rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      player.missedAttacks++
    }

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false
    }

    // this is where our player gets hit
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false
    }
    else if (
      !rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      enemy.missedAttacks++
    }

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId })
      timer = 60
      if (TRAININGMODE === "ONE") {
        enemy = createEnemy()
      }
      fightCount++
    }

  }

  animate()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
      if (gameState === "playing") {
        gameState = "pause"
        console.log(gameState)
      }
      else if (gameState === "pause") {
        gameState = "playing"
        console.log(gameState)
      }
    }
    if (!player.dead) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 'w':
          player.jump()
          break
        case ' ':
          player.attack()
          break
      }
    }

    if (!enemy.dead) {
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          enemy.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          enemy.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          enemy.jump()
          break
        case 'ArrowDown':
          enemy.attack()
          break
      }
    }
  })
}
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

async function loadModel() {
  // const model = await tfl.loadModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
  baseModel1 = await tf.loadLayersModel(tf.io.browserFiles(
    [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
  baseModel2 = await tf.loadLayersModel(tf.io.browserFiles(
    [uploadJSONInput2.files[0], uploadWeightsInput2.files[0]]));
  weightsBaseModel1 = baseModel1.getWeights()
  weightsBaseModel2 = baseModel2.getWeights()
  for (let i = 0; i < TOTAL; i++) {

    if (Math.random() > 0.5) {
      players[i].brain.setModel(baseModel1)
    }
    else {
      players[i].brain.setModel(baseModel2)
    }
  }
  fightCount = 0
  generation = 1
}

function saveStats() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scores));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "gen" + generation + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  // $.ajax({
  //   url: "/test",
  //   type: "POST",
  //   contentType: "application/json",
  //   data: JSON.stringify(dataStr)
  // });

}