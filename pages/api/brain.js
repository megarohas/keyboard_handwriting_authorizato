import withMongoConnect from "../../helpers/back/mongo_connector.js";
import JWTcheck from "../../helpers/back/auth_checker.js";
let random_namer = require("random-name");
let jwt = require("jwt-simple");
let brain = require("brain.js");

// The quick brown fox jumps over the lazy dog.
//нужно отправлять эту строчку, потом пробегаться по ней и составлять массив для каждой буквы, в котором булет ина о буквЕ, времени задержания и времени перехода к ней от предыдущей

// net.fromJSON(json);
//время удержания + промежутки между нажатиями + время полного ввода

// const handler = async (req, res) => {
const handler = async ({ req, res, db }) => {
  const config = {
    binaryThresh: 0.5,
    hiddenLayers: [90], // array of ints for the sizes of the hidden layers in the network
    activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
  };

  // const net = new brain.recurrent.GRU(config);
  const net = new brain.NeuralNetwork(config);
  console.log("before train");
  net.train([
    {
      input: [
        0.131,
        0.083,
        0.123,
        0.112,
        0.115,
        0.078,
        0.083,
        0.087,
        0.091,
        0.06,
        0.053,
        0.071,
        0.083,
        0.113,
        0.071,
        0.048,
        0.079,
        0.071,
        0.147,
        0.124,
        0.072,
        0.079,
        0.059,
        0.08,
        0.079,
        0.053,
        0.071,
        0.075,
        0.101,
        0.101,
        0.128,
        0.091,
        0.075,
        0.147,
        0.1,
        0.094,
        0.095,
        0.111,
        0.143,
        0.136,
        0.083,
        0.059,
        0.056,
        12.519,
        1,
        0
      ],
      output: [1]
    },
    {
      input: [
        0.131,
        0.083,
        0.123,
        0.112,
        0.115,
        0.078,
        0.083,
        0.087,
        0.091,
        0.06,
        0.053,
        0.071,
        0.083,
        0.113,
        0.071,
        0.048,
        0.079,
        0.071,
        0.147,
        0.124,
        0.072,
        0.079,
        0.059,
        0.08,
        0.079,
        0.053,
        0.071,
        0.075,
        0.101,
        0.101,
        0.128,
        0.091,
        0.075,
        0.147,
        0.1,
        0.094,
        0.095,
        0.111,
        0.143,
        0.136,
        0.083,
        0.059,
        0.056,
        12.519,
        0,
        1
      ],
      output: [2]
    },
    {
      input: [
        0.931,
        0.083,
        0.123,
        0.112,
        0.115,
        0.078,
        0.083,
        0.087,
        0.091,
        0.06,
        0.053,
        0.071,
        0.083,
        0.113,
        0.071,
        0.048,
        0.079,
        0.071,
        0.147,
        0.124,
        0.072,
        0.079,
        0.059,
        0.08,
        0.079,
        0.053,
        0.071,
        0.075,
        0.101,
        0.101,
        0.128,
        0.091,
        0.075,
        0.147,
        0.1,
        0.094,
        0.095,
        0.111,
        0.143,
        0.136,
        0.083,
        0.059,
        0.056,
        12.519,
        1,
        1
      ],
      output: [3]
    }
    // { input: [0.56, 0.125, 0.35], output: [0] },
    // { input: [0.57, 0.127, 0.34], output: [0] },
    // { input: [0.58, 0.127, 0.33], output: [0] },
    // { input: [0.59, 0.126, 0.33], output: [0] },
    // { input: [0.54, 0.129, 0.33], output: [0] },
    // { input: [0.53, 0.125, 0.3], output: [0] },
    // { input: [0.54, 0.124, 0.31], output: [0] },
    // { input: [0.59, 0.126, 0.33], output: [0] },
    // { input: [0.54, 0.129, 0.33], output: [0] },
    // { input: [0.53, 0.125, 0.32], output: [0] },
    // { input: [0.54, 0.124, 0.3], output: [0] },
    // { input: [0.55, 0.123, 0.39], output: [0] },
    // { input: [0.56, 0.125, 0.35], output: [0] },
    // { input: [0.57, 0.127, 0.34], output: [0] },
    // ///
    // { input: [0.4, 0.117, 0.25], output: [1] },
    // { input: [0.5, 0.115, 0.2], output: [1] },
    // { input: [0.49, 0.118, 0.22], output: [1] },
    // { input: [0.47, 0.112, 0.23], output: [1] },
    // { input: [0.46, 0.113, 0.28], output: [1] },
    // { input: [0.44, 0.11, 0.23], output: [1] },
    // { input: [0.44, 0.118, 0.2], output: [1] },
    // { input: [0.45, 0.115, 0.22], output: [1] },
    // { input: [0.41, 0.117, 0.25], output: [1] },
    // { input: [0.5, 0.115, 0.2], output: [1] },
    // { input: [0.47, 0.118, 0.22], output: [1] },
    // { input: [0.48, 0.112, 0.23], output: [1] },
    // { input: [0.46, 0.113, 0.28], output: [1] },
    // { input: [0.43, 0.11, 0.23], output: [1] },
    // { input: [0.44, 0.118, 0.2], output: [1] },
    // { input: [0.45, 0.115, 0.22], output: [1] },
    // ///
    // { input: [0.23, 0.107, 0.15], output: [2] },
    // { input: [0.25, 0.105, 0.1], output: [2] },
    // { input: [0.29, 0.108, 0.12], output: [2] },
    // { input: [0.27, 0.102, 0.13], output: [2] },
    // { input: [0.26, 0.103, 0.18], output: [2] },
    // { input: [0.24, 0.1, 0.13], output: [2] },
    // { input: [0.24, 0.108, 0.12], output: [2] },
    // { input: [0.25, 0.105, 0.12], output: [2] },
    // { input: [0.21, 0.107, 0.15], output: [2] },
    // { input: [0.25, 0.105, 0.12], output: [2] },
    // { input: [0.17, 0.108, 0.12], output: [2] },
    // { input: [0.28, 0.102, 0.13], output: [2] },
    // { input: [0.26, 0.103, 0.18], output: [2] },
    // { input: [0.33, 0.101, 0.13], output: [2] },
    // { input: [0.24, 0.108, 0.12], output: [2] },
    // { input: [0.25, 0.105, 0.12], output: [2] }
  ]);
  // net.train([{ input: [0, 0, 0], output: [1] }]);
  // console.log("output", net.run([0, 0, 0]));
  // net.train([{ input: [0, 0, 0], output: [0] }]);
  // console.log("output", net.run([0, 0, 0]));
  // console.log("output", output);
  // let output = 0;
  console.log("run");
  // let output = net.run([49, 000, 20]); // [0.987]
  // let output = 0;
  // console.log("output", output);
  // while (output == null || output == 0 || JSON.stringify(output) == '{"0":0}') {
  //   setTimeout(() => {
  //     output = net.run(["58", "026", "37"]);
  //     console.log("output", JSON.stringify(output));
  //     console.log(
  //       "JSON.stringify(output) == '{:0}'",
  //       JSON.stringify(output) == '{"0":0}'
  //     );
  //   }, 000); // [0.987]
  // }

  // let output = net.run([0.57, 0.127, 0.34]); // [0.987]
  // let output = net.run([0.44, 0.116, 0.24]); // [0.987]
  let output = net.run([
    0.931,
    0.083,
    0.123,
    0.112,
    0.115,
    0.078,
    0.083,
    0.087,
    0.091,
    0.06,
    0.053,
    0.071,
    0.083,
    0.113,
    0.071,
    0.048,
    0.079,
    0.071,
    0.147,
    0.124,
    0.072,
    0.079,
    0.059,
    0.08,
    0.079,
    0.052,
    0.071,
    0.075,
    0.101,
    0.101,
    0.128,
    0.091,
    0.075,
    0.147,
    0.1,
    0.094,
    0.095,
    0.111,
    0.143,
    0.136,
    0.083,
    0.059,
    0.056,
    12.519,
    1,
    1
  ]); // [0.987]
  console.log("output", JSON.stringify(output));
  // let output = net.run(["58", "026", "37"]); // [0.987]
  // console.log("output", JSON.stringify(output));
  // let output = net.run(["49", "000", "20"]); // [0.987]
  // console.log("output", output);
  res.end(JSON.stringify({ output, net: net.toJSON() }));
};

// export default handler;
export default withMongoConnect(handler);
