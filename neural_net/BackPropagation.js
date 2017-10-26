define(["../util/Constants", "neural_net/Errorcalc"], function(Constants, Errorcalc) {

    var BackPropagation = function(topoObj, webWorkerContxt, useSftmx = false) {

        this.objectType = "backprop"; //required for rendering
        this.webWorkerContext = webWorkerContxt;
        this.useSoftmax = useSftmx;
    }
    BackPropagation.prototype.performBackPropagation = function(currentPass, layerToNeuronDict, inputLayerIndex, outputLayerIndex, outputArray) {
        this.layerToNeuronDict = layerToNeuronDict;
        //find the node delta of each neuron
        //starting from the hidden layers as the error and gradient of the output layer is already found by the error calculation
        for (let i = outputLayerIndex - 1; i >= inputLayerIndex; i--) {

            var neuronsInTheLayer = this.layerToNeuronDict[i];
            //for each of the neuron perform the operations
            for (let j = 0; j < neuronsInTheLayer.length; j++) {
                Constants.wait();
                var eachNeuron = neuronsInTheLayer[j];
                var outputConnections = eachNeuron.conOut;
                var inputConnections = eachNeuron.conIn;

                if (inputConnections.length > 0 && outputConnections.length > 0) {
                    //assuming this is the hidden neurons
                    var sum = 0;
                    for (let eachOutgoingConnectionIndex = 0; eachOutgoingConnectionIndex < outputConnections.length; eachOutgoingConnectionIndex++) {
                        let eachConnection = outputConnections[eachOutgoingConnectionIndex];
                        let eachConnectionWeight = eachConnection.weight;
                        let eachForwardNeuronNodeDeltaValue = eachConnection.forwardNeuron.nodeDelta;
                        sum += (eachConnectionWeight * eachForwardNeuronNodeDeltaValue);

                        //find local gradient of the connection
                        this.layerToNeuronDict[i][j].conOut[eachOutgoingConnectionIndex].updateLocalGradientAndRecalculateWeights(eachNeuron.activatedValue * eachForwardNeuronNodeDeltaValue);

                    }
                    //required for any hidden layer previous(-1) to this layer
                    this.layerToNeuronDict[i][j].nodeDelta = eachNeuron.getDerivativeValue() * sum;


                } else {
                    //for the input layer neurons find the local gradient only as finding node delta doesnt make sense
                    for (let eachOutgoingConnectionIndex = 0; eachOutgoingConnectionIndex < outputConnections.length; eachOutgoingConnectionIndex++) {
                        let eachConnection = outputConnections[eachOutgoingConnectionIndex];
                        let eachForwardNeuronNodeDeltaValue = eachConnection.forwardNeuron.nodeDelta;

                        //find local gradient of the connection
                        this.layerToNeuronDict[i][j].conOut[eachOutgoingConnectionIndex].updateLocalGradientAndRecalculateWeights(eachNeuron.currentValue * eachForwardNeuronNodeDeltaValue);

                    }

                }
            }
        }
        return this.layerToNeuronDict;

    }

    console.log("BackPropagation loaded");
    return BackPropagation;
});