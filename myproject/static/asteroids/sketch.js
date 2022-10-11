// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/hacZU523FyM

let ship;
let TOTAL = 1
let games = []
let savedGames = []
const canvasWidth = 1024
const canvasHeight = 1024
let generation = 1
let generationDiv
mutationRate = 0.1

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  games.push(new Game(true))
  for (let i = 0; i < TOTAL; i++) {
    games.push(new Game())
  }
  generationDiv = document.getElementById("generation")
}

function draw() {
  generationDiv.innerHTML = "Generation : " + generation
  if (games.length > 0) {
    background(0);
    games[0].doRender = true
    for (let i = 0; i < games.length; i++) {
      games[i].update()
      if (games[i].ship.dead) {
        savedGames.push(games.splice(i, 1)[0])
      }
    }
  }
  else {
    nextGeneration()
  }
}

async function loadModel() {
  // const model = await tfl.loadModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
  baseModel1 = await tf.loadLayersModel(tf.io.browserFiles(
    [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
  // baseModel2 = await tf.loadLayersModel(tf.io.browserFiles(
  //   [uploadJSONInput2.files[0], uploadWeightsInput2.files[0]]));
  weightsBaseModel1 = baseModel1.getWeights()
  // weightsBaseModel2 = baseModel2.getWeights()
  for (let i = 0; i < TOTAL; i++) {
    games[i].ship.brain.setModel(baseModel1)
  }
}
// function keyReleased() {
//   ship.setRotation(0);
//   ship.boosting(false);
// }

// function keyPressed() {
//   if (key == ' ') {
//     ship.fire()
//   } else if (keyCode == RIGHT_ARROW) {
//     ship.setRotation(0.1);
//   } else if (keyCode == LEFT_ARROW) {
//     ship.setRotation(-0.1);
//   } else if (keyCode == UP_ARROW) {
//     ship.boosting(true);
//   }
// }
