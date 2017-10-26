define(["../util/Constants", "neural_net/Activation"], function(Constants, Activation) {

    var ErrorOperations = function(topoObj, webworkerContext, layerToNeuronDict) {
        this.topoObj = topoObj
        this.webWorkerContext = webworkerContext;

    }
    ErrorOperations.prototype.calculateError = function(currentPass, errorAlgo, layerToNeuronDict, outputArray) {
        // outputArray; //[1,0,0]
        debugger;
        var ouputLayerNeurons = layerToNeuronDict[this.topoObj.outputLayerIndex];
        var currentValueOfEachNeuron = [];
        //This is only for the outputlayer------------NO HIDDEN LAYER INVOLVED IN THIS CALCULATION
        for (let eachOutputLayerNeuronIndex = 0; eachOutputLayerNeuronIndex < ouputLayerNeurons.length; eachOutputLayerNeuronIndex++) {

            let eachOutputLayerNeuron = ouputLayerNeurons[eachOutputLayerNeuronIndex];
            let activatedValue = eachOutputLayerNeuron.activatedValue;
            let currentValue = eachOutputLayerNeuron.currentValue;
            let idealOutput = outputArray[eachOutputLayerNeuronIndex];

            currentValueOfEachNeuron[eachOutputLayerNeuronIndex] = currentValue;
            var errorValue = null;

            if (errorAlgo === Constants.SIMPLE_DIFFERENCE) {
                errorValue = this.calculateSimpleDifference(activatedValue, idealOutput)

            } else if (errorAlgo === Constants.ERROR_MEAN_DIFFERENCE) {
                errorValue = this.calculateMeanDifference(activatedValue, idealOutput)


            } else if (errorAlgo === Constants.AVERAGE_MEAN_DIFFERENCE) {
                errorValue = this.calculateAverageMeanDifference(activatedValue, idealOutput)


            }
            if (errorValue !== null) {
                layerToNeuronDict[this.topoObj.outputLayerIndex][eachOutputLayerNeuronIndex].errorValue = errorValue;
                layerToNeuronDict[this.topoObj.outputLayerIndex][eachOutputLayerNeuronIndex].nodeDelta = errorValue * eachOutputLayerNeuron.getDerivativeValue()
                this.webWorkerContext.postMessage([Constants.RENDER_ERROR_POINTS, currentPass, errorValue]);
            }

        }
        if (errorAlgo === Constants.CROSS_ENTROPY) {
            let softmaxValues = Activation.softmax(currentValueOfEachNeuron);
            var error = this.calculateCrossEntropy(softmaxValues, outputArray)
            this.webWorkerContext.postMessage([Constants.RENDER_ERROR_POINTS, currentPass, error]);
            let softmaxDerivativeValues = Activation.softmaxDerivative(currentValueOfEachNeuron);
            debugger;
            for (let eachOutputLayerNeuronIndex = 0; eachOutputLayerNeuronIndex < ouputLayerNeurons.length; eachOutputLayerNeuronIndex++) {
                layerToNeuronDict[this.topoObj.outputLayerIndex][eachOutputLayerNeuronIndex].activatedValue = softmaxValues[eachOutputLayerNeuronIndex];
                layerToNeuronDict[this.topoObj.outputLayerIndex][eachOutputLayerNeuronIndex].errorValue = error;
                layerToNeuronDict[this.topoObj.outputLayerIndex][eachOutputLayerNeuronIndex].nodeDelta = error * softmaxDerivativeValues[eachOutputLayerNeuronIndex]

            }
        }
        return layerToNeuronDict;


    }

    ErrorOperations.prototype.calculateSimpleDifference = function(actual, ideal) {
        var errorDif = actual - ideal;
        return errorDif;
    }
    ErrorOperations.prototype.calculateMeanDifference = function(actual, ideal) {
        var errorDif = this.calculateSimpleDifference(ideal, actual);
        return errorDif * errorDif;
    }

    ErrorOperations.prototype.calculateAverageMeanDifference = function(actual, ideal) {
        var errorDif = this.calculateSimpleDifference(ideal, actual);
        return (errorDif * errorDif) / 2;
    }


    ErrorOperations.prototype.calculateCrossEntropy = function(softmaxOutputProbabilityArray, outputArray) {
        var totalError = 0;
        for (let i = 0; i < softmaxOutputProbabilityArray.length; i++) {
            let error = this.calculateCrossEntropyLoss(softmaxOutputProbabilityArray[i], outputArray[i]);
            totalError += error;
        }
        return totalError;
    }

    ErrorOperations.prototype.calculateCrossEntropyLoss = function(softmaxProbability, outputProbability) {

        return outputProbability * Math.log2(softmaxProbability)
    }

    return ErrorOperations;

});