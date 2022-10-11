
function Population(sizePop, list) {

    this.vehicles = [];
    this.sizePop = sizePop;

    if (list === undefined) {

        for (var i = 0; i < this.sizePop; i++) {
            var x = random(width);
            var y = random(height);
            this.vehicles[i] = new Vehicle(x, y);
        }
    }

    this.nextGen = function () {

        var limit = floor(this.vehicles.length / 2);
        var tempVehicles = [];
        var newVehicles = [];
        for (var i = 0; i < limit; i++) {
            tempVehicles[i] = this.selectParent();
            //console.log(tempVehicles);
        }

        for (var i = 0; i < this.sizePop; i++) {
            var x = random(width);
            var y = random(height);
            this.vehicles[i] = new Vehicle(x, y);
        }

        for (var i = 0; i < tempVehicles.length; i++) {
            this.vehicles.push(tempVehicles[i]);
        }

        nextGenAsked = false;

    }

    this.selectParent = function () {

        var ltSum = 0;
        var runningSum = 0;
        //console.log('select parent appelee');

        for (var i = 0; i < this.vehicles.length; i++) {
            ltSum += this.vehicles[i].lifeTime;
        }

        var prob = random(ltSum);
        for (var i = 0; i < this.vehicles.length; i++) {

            runningSum += this.vehicles[i].lifeTime;

            if (runningSum >= prob) {
                //console.log(this.vehicles[i]);
                return this.vehicles[i];
            }

        }
        return 5;
    }

}
