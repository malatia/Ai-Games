class Brain {
    constructor(a, b, c, d) {
        if (typeof (a) === "object") {
            this.model = a;
            this.input_nodes = b;
            this.hidden_nodes = c;
            this.output_nodes = d;
        } else {
            this.input_nodes = a;
            this.hidden_nodes = b;
            this.output_nodes = c;
            this.model = this.createModel();
        }
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            return new Brain(
                modelCopy,
                this.input_nodes,
                this.hidden_nodes,
                this.output_nodes
            );
        });
    }

    setModel(model) {
        this.model = model
    }

    mutate(rate) {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (Math.random(1) < rate) {
                        let w = values[j];
                        values[j] = w + randomGaussian();
                        // values[j] = Math.random() > 0.5 ? w + 0.2 : w - 0.2
                        // values[j] = Math.random() > 0.5 ? w *= 1.1 : w *= 0.9
                    }
                }
                let newTensor = tf.tensor(values, shape);
                mutatedWeights[i] = newTensor;
            }
            this.model.setWeights(mutatedWeights);
        });
    }

    dispose() {
        this.model.dispose();
    }

    predict(inputs) {
        return tf.tidy(() => {
            const xs = tf.tensor2d([inputs]);
            const ys = this.model.predict(xs);
            const outputs = ys.dataSync();
            return outputs;
        });
    }

    createModel() {
        // const model = tf.sequential();
        // const hidden = tf.layers.dense({
        //     units: this.hidden_nodes,
        //     inputShape: [this.input_nodes],
        //     activation: 'sigmoid'
        // });
        // model.add(hidden);
        // const output = tf.layers.dense({
        //     units: this.output_nodes,
        //     activation: 'softmax'
        // });
        // model.add(output);


        const input = tf.input({ shape: [this.input_nodes] });
        const dense1 = tf.layers.dense({ units: this.hidden_nodes, activation: 'sigmoid' }).apply(input);
        const dense2 = tf.layers.dense({ units: this.hidden_nodes, activation: 'sigmoid' }).apply(dense1);
        const dense3 = tf.layers.dense({ units: this.output_nodes, activation: 'softmax' }).apply(dense2);
        const model = tf.model({ inputs: input, outputs: dense3 });

        return model;
    }
}