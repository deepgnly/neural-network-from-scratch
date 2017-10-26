define(["neural_net/Topology", "neural_net/Feedforward", "neural_net/BackPropagation", "neural_net/ErrorOperations", "../util/Constants"], function(Topology, Feedforward, BackPropagation, ErrorOperations, Constants) {


    var Network = function(topo, webWorkerContext, layerToNeuronDict) {

        this.topoObj = topo;
        this.webWorkerContext = webWorkerContext;

        this.layerToNeuronDict = layerToNeuronDict
    }
    Network.prototype.startNetworkWithPasses = function(inputArray, outputArray, passes, useSoftmax = false) {
        var feedforwardObj = new Feedforward(this.topoObj, this.webWorkerContext, useSoftmax);
        var backpropagationObj = new BackPropagation(this.topoObj, this.webWorkerContext, useSoftmax);
        var errorOperationObj = new ErrorOperations(this.topoObj, this.webWorkerContext);

        var currentPass = 0;
        var stepsCounter = 0;
        for (currentPass = 0; currentPass < passes; currentPass++) {
            //console.log("Current pass-" + currentPass);
            this.webWorkerContext.postMessage([Constants.RENDER_PASS, currentPass])
            for (let i = 0; i < inputArray.length; i++) {
                stepsCounter++;
                this.webWorkerContext.postMessage([Constants.RENDER_CURRENT_PROPAGATION, Constants.FORWARD_PROP])
                this.layerToNeuronDict = feedforwardObj.performFeedForward(stepsCounter, this.layerToNeuronDict, inputArray[i], outputArray[i]);
                this.layerToNeuronDict = errorOperationObj.calculateError(currentPass, Constants.CROSS_ENTROPY, this.layerToNeuronDict, outputArray[i]);
                this.webWorkerContext.postMessage([Constants.RENDER_CURRENT_PROPAGATION, Constants.BACKWARD_PROP])
                this.layerToNeuronDict = backpropagationObj.performBackPropagation(stepsCounter, this.layerToNeuronDict, this.topoObj.inputLayerIndex, this.topoObj.outputLayerIndex, outputArray[i])
            }
        }
        this.webWorkerContext.postMessage([Constants.OPS_LEARN_NETWORK_FINISHED])
    }

    console.log("Network loaded");

    return Network;

});