async function nextGeneration() {
    console.log('next generation');
    calculateFitness()
    savedPlayers.sort((a, b) => a.score - b.score);
    savedEnemies.sort((a, b) => a.score - b.score);
    console.log("best player " + savedPlayers[savedPlayers.length - 1].score)
    console.log("best enemy " + savedEnemies[savedEnemies.length - 1].score)
    console.log("worst player " + savedPlayers[0].score)
    console.log("worst enemy " + savedEnemies[0].score)
    let newEntities = Math.floor(TOTAL / 10)
    let bestFromLast = Math.floor(TOTAL / 10)
    let bestFromLastMutated = Math.floor(TOTAL / 10)
    let lastThreshold = newEntities + bestFromLast + bestFromLastMutated
    players = []
    enemies = []

    for (let i = 0; i < newEntities; i++) {
        let playerTemporary = createPlayer()
        playerTemporary.brain.createBaseModel()
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
    // for (let i = 0; i < savedPlayers.length - 1; i++) {
    //     savedPlayers[i].dispose();
    //     savedEnemies[i].dispose();
    // }

    // for (let i = 0; i < TOTAL; i++) {
    //     players[i] = createPlayer()
    //     enemies[i] = createEnemy()
    //     fightCount = 0
    // }


    if (generation % 12 === 0) {
        let modelName
        let date = new Date()
        jour = date.getDate()
        mois = date.getMonth() + 1

        for (i = 1; i < 4; i++) {
            modelName = jour + "-" + mois + "-" + "gen" + generation + "n" + i
            await savedPlayers[savedPlayers.length - i].brain.model.save('downloads://' + modelName);
        }
    }
    generation++

    savedPlayers = [];
    savedEnemies = [];
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