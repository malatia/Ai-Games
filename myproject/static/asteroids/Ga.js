async function download_models() {
    let modelName
    let date = new Date()
    jour = date.getDate()
    mois = date.getMonth() + 1
    for (i = 1; i <= best_three.length; i++) {
        modelName = "AS-" + jour + "-" + mois + "-" + "gen" + generation + "n" + i
        await best_three[i - 1].ship.brain.model.save('downloads://' + modelName);
    }
}

function nextGeneration() {
    console.log('next generation');
    calculateFitness()
    savedGames.sort((a, b) => a.score - b.score);
    console.log("best player " + savedGames[savedGames.length - 1].score)
    console.log("worst player " + savedGames[0].score)

    bestScore = savedGames[savedGames.length - 1].score
    lowestScore = savedGames[0].score
    let sumScores = 0
    for (let player of savedGames) {
        sumScores += player.score;
    }
    let averageScore = sumScores / savedGames.length
    scores.generations.push({
        highest_score: bestScore, lowest_score: lowestScore,
        average_score: averageScore, generation_number: generation
    })

    let newEntities = Math.floor(TOTAL / 10)
    let bestFromLast = Math.floor(TOTAL / 10)
    let bestFromLastMutated = Math.floor(TOTAL / 10)
    let lastThreshold = newEntities + bestFromLast + bestFromLastMutated

    for (let i = 0; i < newEntities; i++) {
        games.push(new Game);
    }
    for (let i = 0; i < bestFromLast; i++) {
        games.push(savedGames[savedGames.length - i - 1]);
    }
    for (let i = 0; i < bestFromLast; i++) {
        games.push(pickOne(0.6));
    }

    for (let i = lastThreshold; i < TOTAL; i++) {
        games.push(pickOne(mutationRate));
    }
    // for (let i = 0; i < savedPlayers.length - 1; i++) {
    //     savedPlayers[i].dispose();
    //     savedEnemies[i].dispose();
    // }
    best_three = []
    best_three = [savedGames[savedGames.length - 1], savedGames[savedGames.length - 2], savedGames[savedGames.length - 3]]
    savedGames = []
    // for (let i = 0; i < TOTAL; i++) {
    //     players[i] = createPlayer()
    //     enemies[i] = createEnemy()
    //     fightCount = 0
    // }


    generation++
}

function pickOne(mutation) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
        r = r - savedGames[index].fitness;
        index++;
    }
    index--;
    let child
    let game = savedGames[index];
    if (game.score === 0) {
        child = new Game()
    }
    else {
        console.log("Enfin un mec à garder")
        child = new Game((false, game.brain))
        child.mutate(mutation)
    }
    return child;
}


function calculateFitness() {
    let sumGames = 0;
    for (let game of savedGames) {
        sumGames += game.score;
    }
    for (let game of savedGames) {
        game.fitness = game.score / sumGames;
    }

}