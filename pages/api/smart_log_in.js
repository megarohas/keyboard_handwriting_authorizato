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
      let db_users = await users.find().exec();
      let last_created_user =
        db_users.length > 0 ? db_users[db_users.length - 1] : { id: "-1" };
      let last_created_net =
        db_nets.length > 0 ? db_nets[db_nets.length - 1] : { id: "-1" };
      let user = await users.findOne({ email });
      let config = {
        binaryThresh: 0.5,
        hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
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

      let rounder = (number, delta) => {
        if (!number.toString().split(".")[1]) return number;
        let number_integer = Math.trunc(parseFloat(number));
        let number_fraction = number.toString().split(".")[1];

        let low = "0";
        let high = "10";
        while (number_fraction.length < delta.toString().length) {
          number_fraction += "0";
        }
        while (number_fraction.length > delta.toString().length) {
          number_fraction = number_fraction.substring(
            0,
            number_fraction.length - 1
          );
        }
        while (high.length < delta.toString().length + 1) {
          high += "0";
        }

        console.log("low", low);
        console.log("high", high);
        console.log("number_integer", number_integer);
        console.log("number_fraction", number_fraction);
        console.log("delta", delta);

        number_fraction = parseInt(number_fraction);
        delta = parseInt(delta);
        low = parseInt(low);
        high = parseInt(high);

        if (
          (number_fraction <= delta && number_fraction >= 0) ||
          (number_fraction >= high - delta && number_fraction < high)
        ) {
          if (number_fraction <= delta && number_fraction >= 0) {
            return number_integer;
          } else {
            return number_integer + 1;
          }
        } else {
          return parseInt(-99999);
        }
      };

      let possible_id = rounder(output["0"], 2);
      // let pre_possible_id = output["0"].toString().split(".")[1]
      //   ? output["0"].toString().split(".")[1][0] == "0" ||
      //     output["0"].toString().split(".")[1][0] == "9"
      //     ? parseFloat(output["0"])
      //     : parseFloat(-99999)
      //   : output["0"];
      // let possible_id =
      //   Math.trunc(parseFloat(output["0"])) == parseInt(last_created_user.id)
      //     ? Math.floor(pre_possible_id)
      //     : Math.round(parseFloat(pre_possible_id));
      console.log("smart_log_in possible_id *******", possible_id);
      console.log("smart_log_in user_id *******", user.id);

      if (user.id.toString() == possible_id.toString()) {
        let trainers = last_created_net.trainers || "";
        let new_net = {
          phrase: last_created_net.phrase,
          net: JSON.stringify(net.toJSON()),
          train_memory: JSON.stringify({ inputs: [] }),
          trainers: trainers + ", " + user.id.toString()
        };

        nets.update({ id: last_created_net.id }, new_net, {}, err => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ status: "error" }));
          } else {
            res.statusCode = 200;
            let token = jwt.encode({ email }, "lhbcyz");
            res.end(JSON.stringify({ token }));
          }
        });
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
