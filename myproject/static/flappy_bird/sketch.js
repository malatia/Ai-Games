const TOTAL = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let speed;
let difficulty;
let generation = 1;
let scores;
let baseModel;
let uploadJSONInput;
let uploadWeightsInput;
let generation_div;
let population_div;
let saveStatsButton
let saveModels
let loadModel


function setup() {
    let cnv = createCanvas(700, 500);
    cnv.position(0, 250)
    tf.setBackend('cpu');
    baseModel = undefined
    scores = { game_name: "flappy_bird", generations: [] }

    uploadJSONInput = document.getElementById('upload-json');
    uploadWeightsInput = document.getElementById('upload-weights');
    generationDiv = createDiv("Generation : " + generation)
    populationDiv = createDiv("Population : " + birds.length)
    populationDiv.position(850, 225)
    populationDiv.style("font-size", "30px")
    generationDiv.position(850, 300)
    generationDiv.style("font-size", "30px")
    saveStatsButton = createButton('Save Stats');
    saveStatsButton.position(850, 450);
    saveStatsButton.mousePressed(saveStats);
    saveStatsButton.attribute("class", "custom-btn btn-9")
    saveModels = createButton('Save Models');
    saveModels.position(850, 550);
    saveModels.mousePressed(download_models);
    saveModels.attribute("class", "custom-btn btn-9")
    loadModel = createButton('Load Model');
    loadModel.position(0, 150);
    loadModel.mousePressed(loadBirdModel);
    loadModel.attribute("class", "custom-btn btn-9")

    speed = createSlider(1, 10, 1);
    speed.position(50, 850);
    var p1 = createP('Speed')
    p1.position(50, 870);
    difficulty = createSlider(1, 50, 5);
    difficulty.position(250, 850);
    var p2 = createP('Difficulty')
    p2.position(250, 870);
    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird();
    }
}

async function draw() {

    generationDiv.html("Generation : " + generation)
    populationDiv.html("Population : " + birds.length)


    for (let n = 0; n < speed.value(); n++) {
        if (counter % 75 == 0) {
            pipes.push(new Pipe());
        }
        counter++;

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();

            for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                    savedBirds.push(birds.splice(j, 1)[0]);
                }
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for (let i = birds.length - 1; i >= 0; i--) {
            if (birds[i].offScreen()) {
                savedBirds.push(birds.splice(i, 1)[0]);
            }
        }

        for (let bird of birds) {
            bird.think(pipes);
            bird.update();
        }

        if (birds.length === 0) {
            counter = 0;
            nextGeneration();
            pipes = [];
        }
    }

    // All the drawing stuff
    background(0);

    for (let bird of birds) {
        bird.show();
    }

    for (let pipe of pipes) {
        pipe.show();
    }
}


async function loadBirdModel() {
    console.log("load model")
    baseModel = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
    console.log("Après le chargement")
    birds = []
    pipes.splice(0, 1);
    for (let i = 0; i < TOTAL; i++) {
        console.log("dans la boucle")
        birds[i] = new Bird();
        birds[i].brain.setModel(baseModel)
    }
    generation = 0
    scores = { game_name: "flappy_bird", generations: [] }
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


