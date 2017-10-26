     importScripts("external_libs/require.js")
     var layerToNeuronDict;
     var topo;
     var input;
     var output;

     self.addEventListener('message', function(e) {
         require(["neural_net/Network", "neural_net/NetworkInit", "../util/Constants"], function(Network, NetworkInit, Constants) {
             let ops = e.data[0];
             webworkerContext = self;

             if (ops === Constants.OPS_INIT_NETWORK) {
                 topo = e.data[1];
                 let nnInit = new NetworkInit(topo);
                 layerToNeuronDict = nnInit.createNeuronAndConnection();
                 webworkerContext.postMessage([Constants.RENDER_WHOLE_NETWORK, layerToNeuronDict])
             } else if (ops === Constants.OPS_LEARN_NETWORK) {
                 input = e.data[1];
                 output = e.data[2];
                 let passes = e.data[3];
                 let useSoftmax = e.data[4];

                 var networkObj = new Network(topo, webworkerContext, layerToNeuronDict);
                 networkObj.startNetworkWithPasses(input, output, passes, useSoftmax);
             }



         }, false);
     });