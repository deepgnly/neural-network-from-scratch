define(["../util/Constants", "neural_net/Activation"], function(Constants, Activation) {


    var Feedforward = function(topo, webworkerContext, useSftmx = false) {
        this.objectType = "feedforward"; //required for rendering
        this.webWorkerContext = webworkerContext;
        this.topoObj = topo;
        this.useSoftmax = useSftmx;
    }

    Feedforward.prototype.performFeedForward = function(currentPass, layerToNeuronDict, eachInput, correspondingOutput) {
        this.layerToNeuronDict = layerToNeuronDict;
        let inputLayerNeurons = this.layerToNeuronDict[this.topoObj.inputLayerIndex];

        //updating the input values to the input neurons
        for (let neuronIndexAtInputLayer = 0; neuronIndexAtInputLayer < inputLayerNeurons.length; neuronIndexAtInputLayer++) {
            this.layerToNeuronDict[this.topoObj.inputLayerIndex][neuronIndexAtInputLayer].updateValue(eachInput[neuronIndexAtInputLayer]);
        }

        //The feedforward operation starts
        for (let i = this.topoObj.inputLayerIndex; i <= this.topoObj.outputLayerIndex; i++) {
            var neuronsAtEachLayer = layerToNeuronDict[i];

            for (let j = 0; j < neuronsAtEachLayer.length; j++) {
                Constants.wait();
                this.feedforwardEachNeuron(i, j, neuronsAtEachLayer[j]);
            }
        }
        this.applySoftmax();
        return this.layerToNeuronDict;

    }
    Feedforward.prototype.feedforwardEachNeuron = function(layerIndex, neuronIndex, eachNeuron) {
        let inwardConnectionsOfEachNeuron = eachNeuron.conIn;
        let outwardConnectionsOfEachNeuron = eachNeuron.conOut;

        //calulate incoming value
        if (inwardConnectionsOfEachNeuron.length > 0) {
            let updatedValueOfNeuron = this.getUpdateValueOfEachNeuronFromIncomingWeights(layerIndex, neuronIndex, inwardConnectionsOfEachNeuron);
            this.layerToNeuronDict[layerIndex][neuronIndex].updateValue(updatedValueOfNeuron);
            if ((layerIndex === this.topoObj.outputLayerIndex) && (this.useSoftmax === true)) {
                return;
            }

            eachNeuron.activate();
        }
        if (outwardConnectionsOfEachNeuron.length > 0) {
            //calculate the outgoing value
            this.updateWeightsOfOutgoingConnection(layerIndex, neuronIndex, outwardConnectionsOfEachNeuron);
        }
        //Send event to render the params on screen        
        this.webWorkerContext.postMessage([Constants.RENDER_ONLY_OBJECT, eachNeuron])

    }

    Feedforward.prototype.getUpdateValueOfEachNeuronFromIncomingWeights = function(layerIndex, neuronIndex, inwardConnectionsOfEachNeuron) {

        var sumOfInwardConnections = 0;

        for (let k = 0; k < inwardConnectionsOfEachNeuron.length; k++) {
            sumOfInwardConnections += this.layerToNeuronDict[layerIndex][neuronIndex].conIn[k].weight;
        }
        return sumOfInwardConnections;

    }

    Feedforward.prototype.updateWeightsOfOutgoingConnection = function(layerIndex, neuronIndex, outwardConnectionOfEachNeuron) {
        var eachNeuron = this.layerToNeuronDict[layerIndex][neuronIndex];

        //If there is output nodes then update them 
        for (let k = 0; k < outwardConnectionOfEachNeuron.length; k++) {
            let updatedWeight = this.layerToNeuronDict[layerIndex][neuronIndex].conOut[k].weight * (eachNeuron.conIn.length == 0 ? eachNeuron.currentValue : eachNeuron.activatedValue);
            this.layerToNeuronDict[layerIndex][neuronIndex].conOut[k].weight = updatedWeight;
        }
    }

    Feedforward.prototype.applySoftmax = function() {
        if (this.useSoftmax === true) {
            var outputLayerNeurons = this.layerToNeuronDict[this.topoObj.outputLayerIndex];
            var softmaxArray = []
            for (let i = 0; i < outputLayerNeurons.length; i++) {
                softmaxArray.push(outputLayerNeurons[i].currentValue);
            }
            var softmaxActivatedValues = Activation.softmax(softmaxArray);
            //for classifications find the cross entropy error here
            console.log(softmaxActivatedValues);

            for (let i = 0; i < outputLayerNeurons.length; i++) {
                this.layerToNeuronDict[this.topoObj.outputLayerIndex][i].softmaxUsed = true;
                this.layerToNeuronDict[this.topoObj.outputLayerIndex][i].updateActivatedValue(softmaxActivatedValues[i]);
                this.webWorkerContext.postMessage([Constants.RENDER_ONLY_OBJECT, this.layerToNeuronDict[this.topoObj.outputLayerIndex][i]]);

            }
        }

    }
    console.log("Feedforward Loaded");

    return Feedforward;
});