import withMongoConnect from "../../helpers/back/mongo_connector.js";
let brain = require("brain.js");
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  try {
    let nets = db.getTable("nets");
    let db_nets = await nets.find().exec();
    let last_created_net =
      db_nets.length > 0 ? db_nets[db_nets.length - 1] : { id: "-1" };

    let config = {
      binaryThresh: 0.5,
      hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
      activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
    };

    // const net = new brain.recurrent.GRU(config);
    let net = await new brain.NeuralNetwork(config);

    let init_train_input = [];
    for (var i = 0; i < req.body.phrase.length; i++) {
      init_train_input.push(0);
    }

    init_train_input.push(0);
    init_train_input.push(0);
    init_train_input.push(0);

    console.log("init_train_input", init_train_input.length);
    net.train([{ input: [...init_train_input], output: [-1] }]);
    // console.log("net.toJSON()", net);

    let net_json = net.toJSON();
    let new_net_data = {
      phrase: req.body.phrase,
      // phrase: req.body.phrase,
      // net: JSON.stringify(net.toJSON()),
      net: net.toJSON(),

      // net: {},
      id: (parseInt(last_created_net.id) + 1).toString()
    };

    let new_net = new nets(new_net_data);

    new_net.save(err => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error" }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ new_net }));
      }
    });
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
