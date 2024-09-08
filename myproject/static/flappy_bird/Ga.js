async function download_models() {
    console.log("Fonction download")
    let modelName
    let date = new Date()
    jour = date.getDate()
    mois = date.getMonth() + 1
    modelName = "FB-" + jour + "-" + mois + "-" + "gen" + generation
    await birds[0].brain.model.save('downloads://' + modelName);
}


function nextGeneration() {
    console.log('next generation');
    calculateFitness();

    savedBirds.sort((a, b) => a.score - b.score);
    console.log("best player " + savedBirds[savedBirds.length - 1].score)
    console.log("worst player " + savedBirds[0].score)

    bestScore = savedBirds[savedBirds.length - 1].score
    lowestScore = savedBirds[0].score
    let sumScores = 0
    for (let bird of savedBirds) {
        sumScores += bird.score;
    }
    let averageScore = sumScores / savedBirds.length
    scores.generations.push({
        highest_score: bestScore, lowest_score: lowestScore,
        average_score: averageScore, generation_number: generation
    })

    console.log("Scores added")

    for (let i = 0; i < TOTAL; i++) {
        birds[i] = pickOne();
    }
    // for (let i = 0; i < TOTAL; i++) {
    //     savedBirds[i].dispose();
    // }
    savedBirds = [];
    generation++
}

function pickOne() {
    let index = 0;
    let r = random(1);
    while (r > 0) {
        r = r - savedBirds[index].fitness;
        index++;
    }
    index--;
    let bird = savedBirds[index];
    let child = new Bird(bird.brain);
    child.mutate();
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let bird of savedBirds) {
        sum += bird.score;
    }
    for (let bird of savedBirds) {
        bird.fitness = bird.score / sum;
    }
}