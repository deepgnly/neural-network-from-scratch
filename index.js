$(document).ready(function() {
    requirejs.config({
        //By default load any module IDs from js/lib
        // baseUrl: 'neural_net',

    });

    function startWorker() {

        if (typeof(Worker) !== "undefined") {
            if (typeof(w) == "undefined") {
                w = new Worker("worker.js");
            }

        } else {
            console.log("Sorry, your browser does not support Web Workers...");
        }
    }
    require(["neural_net/Topology", "ui/Renderer", "../util/Constants", "IrisDataSetOperations.js"], function(Topology, Renderer, Constants, IrisDataSetOperations) {
        let topo = new Topology(4, 1, 3, 4);
        let renderObj = new Renderer(topo);
        let irisDataObj = new IrisDataSetOperations(onDataLoaded);

        function onDataLoaded() {

            var input = [
                [1, 1],
                [0, 1],
                [1, 0],
                [0, 0]
            ];
            var output = [
                [1],
                [0],
                [0],
                [1]
            ];

            let resp = irisDataObj.getTrainingAndTestingData(60, 40);
            input = resp[0];
            output = resp[1];

            testingData = resp[2];
            testingOutput = resp[3];

            var passes = 10;
            var useSoftmax = true;


            function subscribeEventsFromWorker() {
                w.onmessage = function(event) {
                    if (event.data[0] === Constants.RENDER_PASS)
                        renderObj.updatePass(event.data[1])

                    else if (event.data[0] === Constants.RENDER_WHOLE_NETWORK)
                        renderObj.createInitialObjectLayer(event.data[1])

                    else if (event.data[0] === Constants.RENDER_ONLY_OBJECT)
                        renderObj.updateSpecificObject(event.data[1])

                    else if (event.data[0] === Constants.RENDER_CURRENT_PROPAGATION)
                        renderObj.updatePropagationOperation(event.data[1])

                    else if (event.data[0] === Constants.RENDER_ERROR_POINTS) {
                        var currentPass = event.data[1];
                        var errorPoint = event.data[2];
                        renderObj.updateChartData(currentPass, errorPoint);
                    } else if (Constants.OPS_LEARN_NETWORK_FINISHED) {
                        renderObj.renderErrorChartWithUpdatedValues();
                    }

                };
            }
            renderObj.initErrorChart();
            startWorker();
            subscribeEventsFromWorker();
            w.postMessage([Constants.OPS_INIT_NETWORK, topo]);



            $("#startTraining").click(function() {
                w.postMessage([Constants.OPS_LEARN_NETWORK, input, output, passes, useSoftmax]);

            });
        }

    });
});