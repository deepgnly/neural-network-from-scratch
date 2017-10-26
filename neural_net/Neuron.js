define(['neural_net/Activation'], function(Activation) {

    var Neuron = function(layerNum, id) {
        this.id = "N" + layerNum + "" + id
        this.layerNumber = layerNum;

        this.currentValue = null;
        this.previousValue = null;
        //activatedValue
        this.activatedValue = null;
        this.previousActivatedValue = null;
        //for storing connections
        this.conOut = [];
        this.conIn = [];

        //required for backpropagation
        this.nodeDelta = null;
        this.objectType = "neuron"; //required for rendering

        this.softmaxUsed = false;

        //only for output neuron
        this.errorValue;

    }
    Neuron.prototype.setOutwardConnection = function(con_out) {
        this.conOut.push(con_out);
    }

    Neuron.prototype.setInwardConnection = function(con_in) {
        this.conIn.push(con_in);
    }

    Neuron.prototype.updateValue = function(updatedValue) {
        this.previousValue = this.currentValue;
        this.currentValue = updatedValue;
    }
    Neuron.prototype.updateActivatedValue = function(updatedActivatedValue) {
        this.previousActivatedValue = this.activatedValue;
        this.activatedValue = updatedActivatedValue;
    }

    Neuron.prototype.activate = function(activationFunctionType) {
        let activatedValue = Activation.sigmoid(this.currentValue);
        if (activatedValue == 0)
            debugger;
        this.updateActivatedValue(activatedValue);
    }

    Neuron.prototype.getDerivativeValue = function() {
        return Activation.derivativeSigmoid(this.currentValue)
    }

    Neuron.prototype.setErrorObj = function(errorObj) {
        this.errorObj = errorObj;
    }

    console.log("Activation Loaded");

    return Neuron;


});