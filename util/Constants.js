define(function() {
    var Constants = function() {

    }
    Constants.RENDER_WHOLE_NETWORK = "RENDER_WHOLE_NETWORK";
    Constants.RENDER_ONLY_OBJECT = "RENDER_ONLY_OBJECT";
    Constants.RENDER_PASS = "RENDER_PASS";
    Constants.RENDER_CURRENT_PROPAGATION = "CURRENT_PROPAGATION";
    Constants.RENDER_ERROR_POINTS = "RENDER_ERROR_POINTS";



    Constants.OPS_INIT_NETWORK = "INIT_NETWORK";
    Constants.OPS_LEARN_NETWORK = "LEARN_NETWORK";
    Constants.OPS_LEARN_NETWORK_FINISHED = "OPS_LEARN_NETWORK_FINISHED";

    Constants.WAIT_TIME = 10;

    Constants.FORWARD_PROP = "Forward Propagation";
    Constants.BACKWARD_PROP = "Backward Propagation";

    Constants.SIMPLE_DIFFERENCE = "SIMPLE_DIFFERENCE";
    Constants.ERROR_MEAN_DIFFERENCE = "ERROR_MEAN_DIFFERENCE";
    Constants.AVERAGE_MEAN_DIFFERENCE = "AVERAGE_MEAN_DIFFERENCE";
    Constants.CROSS_ENTROPY = "CROSS_ENTROPY";






    Constants.wait = function() {
        var ms = Constants.WAIT_TIME
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }


    }
    return Constants;
});