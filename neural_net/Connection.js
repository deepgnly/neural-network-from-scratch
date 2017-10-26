define(["neural_net/Neuron"], function() {

    var Connection = function(identifier, wght, forwardNeuron) {
        this.id = identifier;

        this.weight = wght;


        //required for recalculation of weights
        this.previousBackPropagatedWeight = 0;
        this.forwardNeuron = forwardNeuron;

        this.localGradient = 0;
        this.previousLocalGradient = 0;

        this.objectType = "connection"; //required for rendering

        this.learningFactor = 0.0001;
        this.momentum = .25;

    }
    Connection.prototype.updateBackPropagatedWeight = function(newWeight) {
        this.previousBackPropagatedWeight = this.weight;
        this.weight = newWeight;
    }

    Connection.prototype.updateLocalGradientAndRecalculateWeights = function(newGradient) {
        this.previousLocalGradient = this.localGradient;
        this.localGradient = newGradient;
        this.reCalculateWeightsForBackPropagation();
    }
    Connection.prototype.reCalculateWeightsForBackPropagation = function() {
        var newWeight = (this.learningFactor * this.localGradient) + (this.momentum * this.previousBackPropagatedWeight);
        this.updateBackPropagatedWeight(newWeight);
    }

    console.log("Connection Loaded");

    return Connection;
});