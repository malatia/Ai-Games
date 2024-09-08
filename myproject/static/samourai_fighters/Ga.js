async function download_models() {
    let modelName
    let date = new Date()
    jour = date.getDate()
    mois = date.getMonth() + 1
    for (i = 1; i <= best_three.length; i++) {
        modelName = "SF-" + jour + "-" + mois + "-" + "gen" + generation + "n" + i
        await best_three[i - 1].brain.model.save('downloads://' + modelName);
    }
}



async function nextGeneration() {
    console.log('next generation');
    calculateFitness()
    savedPlayers.sort((a, b) => a.score - b.score);
    savedEnemies.sort((a, b) => a.score - b.score);
    console.log("best player " + savedPlayers[savedPlayers.length - 1].score)
    console.log("best enemy " + savedEnemies[savedEnemies.length - 1].score)
    console.log("worst player " + savedPlayers[0].score)
    console.log("worst enemy " + savedEnemies[0].score)

    bestScore = savedPlayers[savedPlayers.length - 1].score
    lowestScore = savedPlayers[0].score
    let sumScores = 0
    for (let player of savedPlayers) {
        sumScores += player.score;
    }
    let averageScore = sumScores / savedPlayers.length
    scores.generations.push({
        highest_score: bestScore, lowest_score: lowestScore,
        average_score: averageScore, generation_number: generation
    })

    console.log("Scores added")

    let newEntities = Math.floor(TOTAL / 10)
    let bestFromLast = Math.floor(TOTAL / 10)
    let bestFromLastMutated = Math.floor(TOTAL / 10)
    let lastThreshold = newEntities + bestFromLast + bestFromLastMutated
    players = []
    enemies = []

    for (let i = 0; i < newEntities; i++) {
        let playerTemporary = createPlayer()
        if (baseModel1 != undefined && baseModel2 != undefined) playerTemporary.brain.createBaseModel()
        players.push(playerTemporary);
        if (TRAININGMODE === "TWO") enemies.push(createEnemy());
    }
    for (let i = 0; i < bestFromLast; i++) {
        let playerTemporary = savedPlayers[savedPlayers.length - i - 1]
        playerTemporary.score = 0
        players.push(playerTemporary);
        if (TRAININGMODE === "TWO") enemies.push(savedEnemies[savedPlayers.length - i - 1]);
    }
    for (let i = 0; i < bestFromLast; i++) {
        players.push(pickOnePlayer(0.6));
        if (TRAININGMODE === "TWO") enemies.push(pickOneEnemy(0.6));
    }


    for (let i = lastThreshold; i < TOTAL; i++) {
        players.push(pickOnePlayer(mutationRate));
        if (TRAININGMODE === "TWO") enemies.push(pickOneEnemy(mutationRate));
    }

    console.log("New generation added")
    // for (let i = 0; i < savedPlayers.length - 1; i++) {
    //     savedPlayers[i].dispose();
    //     savedEnemies[i].dispose();
    // }

    // for (let i = 0; i < TOTAL; i++) {
    //     players[i] = createPlayer()
    //     enemies[i] = createEnemy()
    //     fightCount = 0
    // }


    generation++
    best_three = []
    best_three = [savedPlayers[savedPlayers.length - 1], savedPlayers[savedPlayers.length - 2], savedPlayers[savedPlayers.length - 3]]
    savedPlayers = [];
    savedEnemies = [];
    console.log("tableaux remis à zero")
}

function pickOnePlayer(mutation) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
        r = r - savedPlayers[index].fitness;
        index++;
    }
    index--;
    let child
    let player = savedPlayers[index];
    if (player.score === 0) {
        child = createPlayer()
    }
    else {
        console.log("Enfin un mec à garder")
        child = createPlayer(player.brain);
        child.mutate(mutation);
    }
    return child;
}

function pickOneEnemy() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
        r = r - savedEnemies[index].fitness;
        index++;
    }
    index--;
    let enemy = savedEnemies[index];
    let child = createEnemy(enemy.brain);
    child.mutate();
    return child;
}

function calculateFitness() {
    let sumPlayers = 0;
    let sumEnemies = 0;
    for (let player of savedPlayers) {
        sumPlayers += player.score;
    }
    for (let enemy of savedEnemies) {
        sumEnemies += enemy.score;
    }

    for (let player of savedPlayers) {
        player.fitness = player.score / sumPlayers;
    }
    for (let enemy of savedEnemies) {
        enemy.fitness = enemy.score / sumEnemies;
    }
}