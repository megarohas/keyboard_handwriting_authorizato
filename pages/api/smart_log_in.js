import withMongoConnect from "../../helpers/back/mongo_connector.js";
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");
let brain = require("brain.js");

const handler = async ({ req, res, db }) => {
  console.log("req.body", req.body);
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

    let user = users.findOne({ email });

    let config = {
      binaryThresh: 0.5,
      hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
      activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
    };

    let net = await new brain.NeuralNetwork(config);

    net.fromJSON(JSON.parse(last_created_net.net));

    let output = net.run([...keyboard_actions]); // [0.987]

    console.log("output *******", output);
    // .exec((err, user) => {
    //   if (err) {
    //     res.statusCode = 500;
    //     res.end(JSON.stringify({ status: "error" }));
    //   }
    //   if (!user) {
    //     res.statusCode = 401;
    //     res.end(JSON.stringify({ status: "error" }));
    //   }
    //   bcrypt.compare(password, user.password_hash, (err, valid) => {
    //     if (err) {
    //       res.statusCode = 500;
    //       res.end(JSON.stringify({ status: "error" }));
    //     }
    //     if (!valid) {
    //       res.statusCode = 100;
    //       res.end(JSON.stringify({ status: "error" }));
    //     }
    //     let token = jwt.encode({ email }, "lhbcyz");
    //     res.end(JSON.stringify({ token }));
    //   });
    // });
  }
};

export default withMongoConnect(handler);
