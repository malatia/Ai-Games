// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/hacZU523FyM

let ship;
let TOTAL = 10
let games = []
let savedGames = []
const canvasWidth = 1000
const canvasHeight = 1000
let generation = 1
let generationDiv
let populationDiv
mutationRate = 0.1
let scores
let saveStatsButton
let saveModels
let loadModel
let best_three
let uploadJSONInput;
let uploadWeightsInput;

function setup() {
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(0, 250)
  games.push(new Game(true))
  for (let i = 0; i < TOTAL; i++) {
    games.push(new Game())
  }
  best_three = []
  uploadJSONInput = document.getElementById('upload-json');
  uploadWeightsInput = document.getElementById('upload-weights');

  generationDiv = createDiv("Generation : " + generation)
  populationDiv = createDiv("Population : " + games.length)
  populationDiv.position(1050, 225)
  populationDiv.style("font-size", "30px")
  generationDiv.position(1050, 300)
  generationDiv.style("font-size", "30px")
  saveStatsButton = createButton('Save Stats');
  saveStatsButton.position(1050, 450);
  saveStatsButton.mousePressed(saveStats);
  saveStatsButton.attribute("class", "custom-btn btn-9")
  saveModels = createButton('Save Models');
  saveModels.position(1050, 550);
  saveModels.mousePressed(download_models);
  saveModels.attribute("class", "custom-btn btn-9")
  loadModel = createButton('Load Model');
  loadModel.position(0, 150);
  loadModel.mousePressed(loadAsteroidsModel);
  loadModel.attribute("class", "custom-btn btn-9")
  scores = { game_name: "asteroids", generations: [] };
}

async function draw() {
  generationDiv.html("Generation : " + generation)
  populationDiv.html("Population : " + games.length)
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

async function loadAsteroidsModel() {
  baseModel1 = await tf.loadLayersModel(tf.io.browserFiles(
    [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
  weightsBaseModel1 = baseModel1.getWeights()
  games = []
  for (let i = 0; i < TOTAL; i++) {
    games[i] = new Game()
    games[i].ship.brain.setModel(baseModel1)
  }
  games[0].doRender = true
}


function saveStats() {
  var dataStr = JSON.stringify(scores);
  $.ajax({
    url: "/add_data",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(dataStr)
  });
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
