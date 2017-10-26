define(function() {

    Activation = function() {

    }
    //two-class logistic regression
    //also called the nonlin function
    //value between 0 and 1
    Activation.sigmoid = function(t) {
        return 1 / (1 + Math.pow(Math.E, -t));

    }

    Activation.derivativeSigmoid = function(z) {
        return Math.exp(-z) / Math.pow(1 + Math.exp(-z), 2);

    }

    Activation.derivativeSigmoidAnotherFormula = function(z) {
        let sigmoidVal = this.derivativeSigmoid(z);
        return sigmoidVal * (1 - sigmoidVal);

    }
    //value between -1 to 1.
    Activation.tanh = function(x) {

        if (x === Infinity) {
            return 1;
        } else if (x === -Infinity) {
            return -1;
        } else {
            var y = Math.exp(2 * x);
            if (y != Infinity) {
                return (y - 1) / (y + 1);
            } else {
                return 1;
            }
        }
    }
    Activation.derivativeTanh = function(x) {
        return 1 - Math.pow(x, 2);
    }
    //value lies between 0 and 1
    Activation.softmax = function(arr) {
        return arr.map(function(value, index) {
            return Math.exp(value) / arr.map(function(y /*value*/ ) { return Math.exp(y) }).reduce(function(a, b) { return a + b })
        });
    }

    Activation.softmaxDerivative = function(arrayOfCurrentValue) {
        let computedDerivativeValue = [];
        let sumOfAllInputs = 0;
        for (let i = 0; i < arrayOfCurrentValue.length; i++) {
            sumOfAllInputs += Math.exp(arrayOfCurrentValue[i]);
        }

        for (let i = 0; i < arrayOfCurrentValue.length; i++) {
            let sum = 0;

            for (let j = 0; j < arrayOfCurrentValue.length; j++) {

                if (i != j) {
                    sum += Math.exp(arrayOfCurrentValue[j])
                }
            }
            computedDerivativeValue[i] = (arrayOfCurrentValue[i] * sum) / (sumOfAllInputs * sumOfAllInputs)
        }
        return computedDerivativeValue;
    }
    return Activation;
});