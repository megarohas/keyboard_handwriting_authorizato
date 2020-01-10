import withMongoConnect from "../../helpers/back/mongo_connector.js";
let brain = require("brain.js");
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  try {
    let nets = db.getTable("nets");
    let users = db.getTable("users");
    let trains = db.getTable("trains");
    let db_nets = await nets.find().exec();
    let db_trains = await trains.find().exec();
    let last_created_train =
      db_trains.length > 0 ? db_trains[db_trains.length - 1] : { id: "-1" };
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

    let new_train_data = {
      phrase: last_created_net.phrase,
      // net: Schema.Types.Mixed,
      trainer_id: req.body.id.toString(),
      net_id: last_created_net.id.toString(),
      id: (parseInt(last_created_train.id) + 1).toString(),
      train_data: JSON.stringify(req.body.keyboard_actions),
      train_result: output[0],
      timestamp: Date.now()
    };

    let new_train = new trains(new_train_data);

    nets.update({ id: last_created_net.id }, new_net, {}, err => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error" }));
      } else {
        new_train.save(err => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ status: "error" }));
          } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ last_created_net }));
          }
        });
      }
    });
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
