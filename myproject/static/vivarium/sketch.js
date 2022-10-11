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


function setup() {
    createCanvas(1000, 800);

    population = new Population(50);

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
    slider1.position(150, 810);
    var p1 = createP('Starvation rate')
    p1.position(150, 830);
    slider2 = createSlider(1, 50, 8, 1);
    slider2.position(300, 810);
    var p2 = createP('Mutation rate')
    p2.position(300, 830);
    slider3 = createSlider(5, 25, 10, 1);
    slider3.position(450, 810);
    var p3 = createP('Food Apparition')
    p3.position(450, 830);
    slider4 = createSlider(1, 15, 1, 1);
    slider4.position(600, 810);
    var p4 = createP('Poison Apparition')
    p4.position(600, 830);
    button1 = createButton('Next Gen');
    button1.position(750, 810);
    console.log(button1.value());
    button1.mousePressed(nextGen);
    div = createDiv('Population : ' + population.vehicles.length);


}



function draw() {
    background(51);
    div.html('Population : ' + population.vehicles.length);

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
            population.vehicles.splice(i, 1);
        }

    }

    if (nextGenAsked) {
        population.nextGen();
    }

    lifeDecrease = slider1.value() / 1000;
    mr = slider2.value() / 100;

}


var mr = 0.08;
var lifeDecrease = 0.008;


function nextGen() {
    nextGenAsked = true;
}




