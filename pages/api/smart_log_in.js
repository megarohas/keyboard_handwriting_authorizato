import withMongoConnect from "../../helpers/back/mongo_connector.js";
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");
let brain = require("brain.js");

const handler = async ({ req, res, db }) => {
  try {
    // console.log("req.body", req.body);
    const users = db.getTable("users");
    if (!req.body.email || !req.body.keyboard_actions) {
      res.statusCode = 400;
      res.end(JSON.stringify({ status: "error" }));
    } else {
      let email = req.body.email;
      let keyboard_actions = req.body.keyboard_actions;
      let nets = db.getTable("nets");
      let db_nets = await nets.find().exec();
      let last_created_net =
        db_nets.length > 0 ? db_nets[db_nets.length - 1] : { id: "-1" };
      let user = await users.findOne({ email });
      let config = {
        binaryThresh: 0.5,
        hiddenLayers: [req.body.phrase.length * 3], // array of ints for the sizes of the hidden layers in the network
        activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
        leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
      };
      let net = await new brain.NeuralNetwork(config);

      net.fromJSON(JSON.parse(last_created_net.net));

      let output = net.run([...keyboard_actions]); // [0.987]
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("smart_log_in output *******", output);

      let possible_id = Math.floor(parseFloat(output["0"]));
      console.log("smart_log_in possible_id *******", possible_id);
      console.log("smart_log_in user_id *******", possible_id);

      if (user.id.toString() == possible_id.toString()) {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "success" }));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ status: "error" }));
      }

      // let possible_id = Math.round(parseFloat(output["0"]));
      // console.log("smart_log_in possible_id *******", possible_id);
    }
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
