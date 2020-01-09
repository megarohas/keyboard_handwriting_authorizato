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

    let train_memory = JSON.parse(last_created_net.train_memory).inputs;

    // console.log("q0 *********", req.headers["authorization"]);
    // console.log("q0.5 *********", req.headers.cookie);

    // let token = req.headers.cookie.split(" token=")[1];
    // if (token.includes(";")) {
    //   token = token.split(";")[0];
    // }

    // console.log("q1 *********", token);
    // let user = await users.findOne({ token });
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("q1 *********", req.body.id);
    let user = await users.findOne({ id: req.body.id });

    console.log("q2 *********");
    let config = {
      binaryThresh: 0.5,
      hiddenLayers: [req.body.keyboard_actions.length * 2], // array of ints for the sizes of the hidden layers in the network
      activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
    };
    console.log("q3 *********");
    let net = await new brain.NeuralNetwork(config);
    console.log("q4 *********");
    // console.log("q4 *********", last_created_net.net);
    net.fromJSON(JSON.parse(last_created_net.net));
    // if (train_memory.length > 0) net.train(train_memory);

    // let output0 = await net.run([...req.body.keyboard_actions]);
    // console.log("q5.0 *********", output0);

    console.log("q5 *********", last_created_net.trainers);

    net.train([
      { input: [...req.body.keyboard_actions], output: [parseInt(user.id)] }
    ]);

    train_memory.push({
      input: [...req.body.keyboard_actions],
      output: [parseInt(user.id)]
    });
    // console.log("q5.9 *********", b);
    // console.log("q5.95 *********", last_created_net.net);
    console.log("q6 *********");
    let output = await net.run([...req.body.keyboard_actions]);
    console.log("q6.5 *********", output);
    last_created_net.net = net.toJSON();
    console.log("q7 *********");
    let trainers = last_created_net.trainers || "";
    let new_net = {
      phrase: last_created_net.phrase,
      // phrase: req.body.phrase,
      // net: JSON.stringify(net.toJSON()),
      net: JSON.stringify(net.toJSON()),
      train_memory: JSON.stringify({ inputs: [] }),
      // train_memory: JSON.stringify({ inputs: [...train_memory] }),
      trainers: trainers + ", " + req.body.id.toString()
      // net: {},
      // id: (parseInt(last_created_net.id) + 1).toString()
    };

    // let new_net = new nets(new_net_data);
    nets.update({ id: last_created_net.id }, new_net, {}, err => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error" }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ last_created_net }));
      }
    });

    // last_created_net.save(err => {
    //   if (err) {
    //     res.statusCode = 500;
    //     res.end(JSON.stringify({ status: "error" }));
    //   } else {
    //     res.statusCode = 200;
    //     res.end(JSON.stringify({ last_created_net }));
    //   }
    // });
    // last_created_net.save((err, obj) => {
    //   console.log("q8 *********", err);
    //   // console.log("q9 *********", obj);
    //   if (err) {
    //     res.statusCode = 500;
    //     res.end(JSON.stringify({ status: "error" }));
    //   } else {
    //     res.statusCode = 200;
    //     res.end(JSON.stringify({ net: obj }));
    //   }
    // });
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
