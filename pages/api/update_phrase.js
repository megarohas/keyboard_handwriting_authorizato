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
    let init_train_input = [];

    for (var i = 0; i < req.body.phrase.length * 2 + 2; i++) {
      init_train_input.push(0);
    }

    let config = {
      binaryThresh: 0.5,
      hiddenLayers: [req.body.phrase.length * 3], // array of ints for the sizes of the hidden layers in the network
      activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
    };

    console.log(
      "update_phrase init_train_input.length",
      init_train_input.length
    );

    let net = await new brain.NeuralNetwork(config);
    net.train([{ input: [...init_train_input], output: [-1] }]);

    let net_json = net.toJSON();
    let new_net_data = {
      phrase: req.body.phrase,
      net: JSON.stringify(net.toJSON()),
      trainers: "",
      train_memory: JSON.stringify({ inputs: [] }),
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
