define(function() {
    console.log("Topology Loaded");


    var Topology = function(lenInputLayer, lenHiddenLayer, lenOutputLayer, lenNeuronInEachHiddenLayer) {
        this.inputNeuronLength = lenInputLayer;
        this.outputNeuronLength = lenOutputLayer;
        this.hiddenLayerLength = lenHiddenLayer;
        this.neuronInEachHiddenLayer = lenNeuronInEachHiddenLayer;
        this.inputLayerIndex = 1;
        this.outputLayerIndex = this.inputLayerIndex + this.hiddenLayerLength + 1
        this.sleepSeconds = 3000;
    }
    return Topology;

});