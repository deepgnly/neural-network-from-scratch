define(function() {
    var Renderer = function(topo) {
        this.topoObj = topo;
        this.errorChartContext;
        this.errorChart_x = [];
        this.errorChart_y = []



    }

    Renderer.prototype.classToPropDict = {
        "neuron": ['layerNumber', 'currentValue', 'previousValue', 'activatedValue', 'previousActivatedValue', "nodeDelta", "softmaxUsed"],
        "connection": ['weight', 'previousBackPropagatedWeight']
    }

    Renderer.prototype.createObjectUI = function(id, className, propertiesToBeShownArray) {

        var $div = $("<div>", {
            id: id,
            "class": "eachClassDiagram " + className
        });

        var $cornerTopRight = $("<div>", {
            id: id + "_corner_topRight",
            "class": "corner  ",
            "text": ".",
            "style": "position: absolute; top: 0;right: 0;"

        });
        var $cornerTopLeft = $("<div>", {
            id: id + "_corner_topLeft",
            "class": "corner ",
            "text": ".",
            "style": "position: absolute; top: 0;left: 0;"
        });
        var $cornerBottomRight = $("<div>", {
            id: id + "_corner_bottomRight",
            "class": "corner ",
            "text": ".",
            "style": "position: absolute; bottom: 0;right: 0;"
        });
        var $cornerBottomLeft = $("<div>", {
            id: id + "_corner_bottomLeft",
            "class": "corner  ",
            "text": ".",
            "style": "position: absolute; bottom: 0;left: 0;"
        });

        $($div).append($cornerTopRight);
        $($div).append($cornerTopLeft);
        $($div).append($cornerBottomRight);
        $($div).append($cornerBottomLeft);




        var $name = $("<div>", {
            "class": "eachClassDiagramName ",
            text: "ObjectName-" + id
        });
        $($div).append($name);


        for (eachPropertyIndex in propertiesToBeShownArray) {
            let eachProperty = propertiesToBeShownArray[eachPropertyIndex];
            let $propertyDiv = $("<span>", {
                id: id + "_" + eachProperty,
                "class": "prop",
                text: eachProperty + "="
            });
            let $propertyVal = $("<span>", {
                id: this._getIdOfValue(id, eachProperty),
                "class": "propVal",
            });
            let $cont = $("<div>", {
                "class": "propContainer"
            });
            $($cont).append($propertyDiv);
            $($cont).append($propertyVal);
            $($div).append($cont);

        }
        return $div


    }

    Renderer.prototype._getIdOfValue = function(id, eachProperty) {
        return id + "_" + eachProperty + "_val";
    }
    Renderer.prototype._getIdOfHorizontalSpan = function(layerId) {
        return "horizontalSpan" + layerId;
    }

    Renderer.prototype.createInitialObjectLayer = function(layerToNeuronDict) {

        for (let layerIndex = this.topoObj.inputLayerIndex; layerIndex <= this.topoObj.outputLayerIndex; layerIndex++) {
            let $horizontalSpan = $("<span>", {
                id: this._getIdOfHorizontalSpan(layerIndex),
                "class": "horizontalSpan"

            });
            $("#neuronContainer").append($horizontalSpan)

        }

        for (let layerIndex = this.topoObj.inputLayerIndex; layerIndex <= this.topoObj.outputLayerIndex; layerIndex++) {
            let neurons = layerToNeuronDict[layerIndex];
            for (let eachNeuronIndex = 0; eachNeuronIndex < neurons.length; eachNeuronIndex++) {
                let eachNeuron = neurons[eachNeuronIndex];
                let divToBeAppended = this.createObjectUI(eachNeuron.id, "neuron", this.classToPropDict['neuron']);
                $("#" + this._getIdOfHorizontalSpan(layerIndex)).append(divToBeAppended);
            }
        }
        this.updateObjectUI(layerToNeuronDict);
        var x1 = document.getElementById("N10_corner_topRight").getBoundingClientRect().x;
        var y1 = document.getElementById("N10_corner_topRight").getBoundingClientRect().y;
        var x2 = document.getElementById("N20_corner_topRight").getBoundingClientRect().x;
        var y2 = document.getElementById("N20_corner_topRight").getBoundingClientRect().y;
        $("#neuronContainer").append(this.createSvgWithLine(x1, y1, x2, y2))
    }

    Renderer.prototype.updateObjectUI = function(updatedLayerToNeuronDict) {

        for (let i = this.topoObj.inputLayerIndex; i < this.topoObj.outputLayerIndex; i++) {
            var currentLayerNeurons = updatedLayerToNeuronDict[i];
            for (let j = 0; j < currentLayerNeurons.length; j++) {
                this.updateSpecificObject(updatedLayerToNeuronDict[i][j])
            }

        }

    }

    Renderer.prototype.updateSpecificObject = function(objectToBeUpdated) {
        let objectId = objectToBeUpdated.id;
        for (let k = 0; k < this.classToPropDict[objectToBeUpdated.objectType].length; k++) {
            let eachProp = this.classToPropDict[objectToBeUpdated.objectType][k];
            if (eachProp in objectToBeUpdated) {
                let currentValue = objectToBeUpdated[eachProp]
                let domId = this._getIdOfValue(objectId, eachProp);
                let domValue = $("#" + domId).text();
                if (domValue != currentValue && currentValue !== null) {
                    $("#" + domId).text(currentValue);
                    this.blink("#" + domId);
                }
            }
        }

    }
    Renderer.prototype.updatePass = function(passNumber) {
        $("#passNumber").text(passNumber);
        this.blink("#passNumber");


    }

    Renderer.prototype.updatePropagationOperation = function(currentOps) {

        $("#propagationOperation").text(currentOps);
        this.blink("#propagationOperation");

    }
    Renderer.prototype.blink = function(elementId) {
        $(elementId).fadeOut(500);
        $(elementId).fadeIn(500);
    }

    Renderer.prototype.createSvgWithLine = function(x1, y1, x2, y2) {

        var svg = '<svg height="210" width="500" ><line x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' style="stroke:rgb(255,0,0);stroke-width:2" /></svg>';
        return svg;
    }

    Renderer.prototype.initErrorChart = function() {

        var _this = this;
        var ctx = document.getElementById('myChart').getContext('2d');
        this.errorChartContext = new Chart(ctx, {
            type: "line",

            data: {
                labels: [],
                datasets: [{
                    data: []
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Passes'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Error'
                        }
                    }]
                }
            }
        });
    }
    Renderer.prototype.updateChartData = function(xx, yy) {
        //console.log(xx + "," + yy);
        this.errorChart_x.push(xx);
        this.errorChart_y.push(yy);
    }

    Renderer.prototype.renderErrorChartWithUpdatedValues = function() {
        this.errorChartContext.config.data.labels = this.errorChart_x;
        var _this = this;
        this.errorChartContext.config.data.datasets.forEach(function(dataset) {
            dataset.data = _this.errorChart_y
        });
        this.errorChartContext.update();
    }


    console.log("Renderer loaded");
    return Renderer;


});