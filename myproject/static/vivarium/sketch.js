var vehicles = [];
var food = [];
var poison = [];
var debug;
var slider1;
var slider2;
var button1;
var population;
var nextGenAsked = false;
var div;
var slider3;
var slider4;
let generation;
let savedPopulation;
let scores;
let saveStatsButton;
let generationDiv;


function setup() {
    createCanvas(1000, 800);

    population = new Population(50);
    generation = 0;
    savedPopulation = [];
    scores = { game_name: "vivarium", generations: [] };

    for (var i = 0; i < 40; i++) {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }

    for (var i = 0; i < 20; i++) {
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }

    nextGenAsked = false;
    debug = createCheckbox();
    createP('Force visibility');
    slider1 = createSlider(5, 15, 8, 1);
    slider1.position(150, 925);
    var p1 = createP('Starvation rate')
    p1.position(150, 950);
    slider2 = createSlider(1, 50, 8, 1);
    slider2.position(350, 925);
    var p2 = createP('Mutation rate')
    p2.position(350, 950);
    slider3 = createSlider(5, 25, 10, 1);
    slider3.position(550, 925);
    var p3 = createP('Food Apparition')
    p3.position(550, 950);
    slider4 = createSlider(1, 15, 1, 1);
    slider4.position(750, 925);
    var p4 = createP('Poison Apparition')
    p4.position(750, 950);
    button1 = createButton('Next Gen');
    button1.attribute("class", "custom-btn btn-9")
    button1.position(950, 900);
    button1.mousePressed(nextGen);
    saveStatsButton = createButton('Save Stats');
    saveStatsButton.attribute("class", "custom-btn btn-9")
    saveStatsButton.position(1020, 550);
    saveStatsButton.mousePressed(saveStats);
    div = createDiv('Population : ' + population.vehicles.length);
    generationDiv = createDiv("Generation : " + generation)
    div.position(1050, 350)
    generationDiv.position(1050, 450)
    div.style("font-size", "30px")
    generationDiv.style("font-size", "30px")



}



function draw() {
    background(51);
    div.html('Population : ' + population.vehicles.length);
    generationDiv.html("Generation : " + generation);

    if (random(1) < slider3.value() / 100) {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }

    if (random(1) < slider4.value() / 100) {
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }


    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 4, 4);
    }

    for (var i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 4, 4);
    }

    for (var i = population.vehicles.length - 1; i >= 0; i--) {
        population.vehicles[i].boundaries();
        population.vehicles[i].behaviors(food, poison);
        population.vehicles[i].update();
        population.vehicles[i].display();
        if (random(1) < 0.005) {
            population.vehicles.push(population.vehicles[i].cloneMe());
        }


        if (population.vehicles[i].dead()) {
            var x = population.vehicles[i].position.x;
            var y = population.vehicles[i].position.y;
            food.push(createVector(x, y));
            savedPopulation.push(population.vehicles.splice(i, 1)[0]);
        }

    }

    if (nextGenAsked) {
        population.nextGen();
    }

    lifeDecrease = slider1.value() / 1000;
    mr = slider2.value() / 100;

    if (frameCount % 650 === 0) {
        calculateScores()
    }

}


var mr = 0.08;
var lifeDecrease = 0.008;


function calculateScores() {
    savedPopulation.sort((a, b) => a.score - b.lifeTime);
    console.log("best player " + savedPopulation[savedPopulation.length - 1].lifeTime)
    console.log("worst player " + savedPopulation[0].lifeTime)

    bestScore = savedPopulation[savedPopulation.length - 1].lifeTime
    lowestScore = savedPopulation[0].lifeTime
    let sumScores = 0
    for (let player of savedPopulation) {
        sumScores += player.lifeTime;
    }
    let averageScore = sumScores / savedPopulation.length
    scores.generations.push({
        highest_score: bestScore, lowest_score: lowestScore,
        average_score: averageScore, generation_number: generation
    })
    savedPopulation = []
    generation++
}

function nextGen() {
    nextGenAsked = true;
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


