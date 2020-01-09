import withMongoConnect from "../../helpers/back/mongo_connector.js";
let brain = require("brain.js");
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  try {
    let nets = db.getTable("nets");
    let users = db.getTable("users");
    let db_nets = await nets.find().exec();
    let last_created_net =
      db_nets.length > 0 ? db_nets[db_nets.length - 1] : { id: "-1" };

    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("train ueser.id *********", req.body.id);
    let user = await users.findOne({ id: req.body.id });

    console.log("train q2 *********");
    let config = {
      binaryThresh: 0.5,
      hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
      activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
    };
    console.log("train q3 *********");
    let net = await new brain.NeuralNetwork(config);
    console.log("train q4 *********");
    net.fromJSON(JSON.parse(last_created_net.net));
    console.log("train q5 *********");
    // console.log("train q5 *********", last_created_net.trainers);
    net.train([
      { input: [...req.body.keyboard_actions], output: [parseInt(user.id)] }
    ]);
    console.log("train q6 *********");
    let output = await net.run([...req.body.keyboard_actions]);
    console.log("train q6.5 *********", output[0]);
    last_created_net.net = net.toJSON();
    console.log("train q7 *********");
    let trainers = last_created_net.trainers || "";
    let new_net = {
      phrase: last_created_net.phrase,
      net: JSON.stringify(net.toJSON()),
      train_memory: JSON.stringify({ inputs: [] }),
      trainers: trainers + ", " + req.body.id.toString()
    };

    nets.update({ id: last_created_net.id }, new_net, {}, err => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error" }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ last_created_net }));
      }
    });
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
