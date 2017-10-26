define(function() {
    var IrisDataSetOperations = function(callback) {
        this.dataSet;
        this.inputArray = [
            [0, 0, 0, 0]
        ];
        this.outputArray = [];

        this.SpeciesToOutputPosition = {
            "setosa": 0,
            "versicolor": 1,
            "virginica": 2
        }

        var _this = this;
        $.ajax({
            type: "GET",
            url: "/dataset/iris.csv",
            dataType: "text",
            success: function(data) {
                _this.dataSet = data;
                $.proxy(_this.convertCsvToArray(), _this);
                callback();

            }
        });

    }
    IrisDataSetOperations.prototype.convertCsvToArray = function() {

        let totalCsv = this.dataSet.split("\n");
        for (let i = 1; i < totalCsv.length; i++) {
            var eachLine = totalCsv[i];
            var eachInputArray = eachLine.split(",");
            let eachOutput = eachInputArray.pop();
            var eachInputArrayConverted = [];
            for (let j = 0; j < eachInputArray.length; j++) {
                if (parseFloat(eachInputArray[j]) > this.inputArray[0][j]) {
                    this.inputArray[0][j] = parseFloat(eachInputArray[j])
                }
                eachInputArrayConverted.push(parseFloat(eachInputArray[j]))
            }
            var eachoutputArray = [0, 0, 0]
            eachoutputArray[this.SpeciesToOutputPosition[eachOutput.trim()]] = 1;
            this.inputArray.push(eachInputArrayConverted)
            this.outputArray.push(eachoutputArray)


        }
        this.normalizeTheInputs();
        this.validateData();
    }

    IrisDataSetOperations.prototype.validateData = function() {
        for (let i = 0; i < this.inputArray.length; i++) {
            let eachStep = this.inputArray[i];
            var normalizedEachStep = []
            for (let j = 0; j < eachStep.length; j++) {
                if (eachStep[j] > 1 || eachStep[j] < -1)
                    console.log("Data is inconsistent at " + i + " " + j);

            }
        }
        console.log("Data validated..data ranges between -1 to +1")

    }

    IrisDataSetOperations.prototype.normalizeTheInputs = function() {
        normalizedInputArray = []
        for (let i = 1; i < this.inputArray.length; i++) {
            let eachStep = this.inputArray[i];
            var normalizedEachStep = []
            for (let j = 0; j < eachStep.length; j++) {
                normalizedEachStep[j] = eachStep[j] / this.inputArray[0][j]
            }
            normalizedInputArray[i - 1] = normalizedEachStep

        }
        this.inputArray = normalizedInputArray;
    }

    IrisDataSetOperations.prototype.getTrainingAndTestingData = function(trainingPercentage, testingPercentage) {
        let totalLength = this.inputArray.length;
        let trainingDataIndex = parseInt(totalLength * trainingPercentage) / 100;

        return [this.inputArray.splice(0, trainingDataIndex), this.outputArray.splice(0, trainingDataIndex), this.inputArray.splice(trainingDataIndex), this.outputArray.splice(trainingDataIndex)]


    }
    return IrisDataSetOperations;
});