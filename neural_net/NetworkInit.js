define(["neural_net/Topology", "neural_net/Neuron", "neural_net/Connection"], function(Topology, Neuron, Connection) {


    var NetworkInit = function(topo) {

        this.topoObj = topo;

        this.layerToNeuronDict = {}
    }
    NetworkInit.prototype.createNeuronAndConnection = function() {
        this.createNeurons();
        this.createConnections();
        return this.layerToNeuronDict
    }

    NetworkInit.prototype.createNeuronAndAddToDict = function(layerIndexNum, indexWithinTheLayer, addToDict) {
        var outputNeuron = new Neuron(layerIndexNum, indexWithinTheLayer);
        if (!(layerIndexNum in addToDict))
            addToDict[layerIndexNum] = [];

        addToDict[layerIndexNum].push(outputNeuron);
    }

    NetworkInit.prototype.createNeurons = function() {
        //create input Neuron
        let layerIndex = this.topoObj.inputLayerIndex;
        for (let i = 0; i < this.topoObj.inputNeuronLength; i++) {
            this.createNeuronAndAddToDict(layerIndex, i, this.layerToNeuronDict);

        }
        //hidden layer
        for (let i = 0; i < this.topoObj.hiddenLayerLength; i++) {
            layerIndex++;
            for (let j = 0; j < this.topoObj.neuronInEachHiddenLayer; j++) {
                this.createNeuronAndAddToDict(layerIndex, j, this.layerToNeuronDict);

            }
        }
        layerIndex++;

        //output layer
        for (let i = 0; i < this.topoObj.outputNeuronLength; i++) {
            this.createNeuronAndAddToDict(layerIndex, i, this.layerToNeuronDict);

        }


    }

    NetworkInit.prototype.createConnections = function() {
        var counter = 0;
        for (let i = this.topoObj.inputLayerIndex; i < this.topoObj.outputLayerIndex; i++) {
            if (i in this.layerToNeuronDict) {
                var nextLayerIndex = i + 1;
                var neuronsInLayer = this.layerToNeuronDict[i];
                var neuronsInNextLayer = this.layerToNeuronDict[nextLayerIndex];
                for (let currentLayerNeuronIndex = 0; currentLayerNeuronIndex < neuronsInLayer.length; currentLayerNeuronIndex++) {

                    for (let nextLayerNeuronIndex = 0; nextLayerNeuronIndex < neuronsInNextLayer.length; nextLayerNeuronIndex++) {
                        var connection = new Connection("w" + counter++, Math.random(), this.layerToNeuronDict[nextLayerIndex][nextLayerNeuronIndex]);
                        this.layerToNeuronDict[i][currentLayerNeuronIndex].setOutwardConnection(connection);
                        this.layerToNeuronDict[nextLayerIndex][nextLayerNeuronIndex].setInwardConnection(connection);

                    }

                }


            }
        }
        console.log(counter);

    }
    console.log("NetworkInit loaded");

    return NetworkInit;

});