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
    hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
    activation: "leaky-relu", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.05 // supported for activation type 'leaky-relu'
  };
  // const config = {
  //   inputSize: 20,
  //   inputRange: 20,
  //   hiddenLayers: [20, 20],
  //   outputSize: 20,
  //   learningRate: 0.01,
  //   decayRate: 0.999
  // };

  // const net = new brain.recurrent.RNN(config);
  // const net = new brain.recurrent.LSTMTimeStep(config);
  // const net = new brain.recurrent.GRU(config);
  //
  const net = new brain.NeuralNetwork(config);

  // const net = new brain.recurrent.LSTMTimeStep({
  //   inputSize: 2,
  //   hiddenLayers: [10],
  //   outputSize: 2
  // });
  console.log("before train");

  let init_train_input = [];
  for (var i = 0; i < 88; i++) {
    init_train_input.push(0);
  }
  let input1 = [
    0.132,
    0.081,
    0.067,
    0.125,
    0.099,
    0.058,
    0.099,
    0.065,
    0.132,
    0.012,
    0.063,
    0.101,
    0.083,
    0.045,
    0.079,
    0.105,
    0.071,
    0.014,
    0.074,
    0.127,
    0.079,
    0.18,
    0.077,
    0.112,
    0.087,
    0.014,
    0.114,
    0.102,
    0.071,
    0.016,
    0.085,
    0.187,
    0.071,
    0.111,
    0.076,
    0.169,
    0.098,
    0.128,
    0.083,
    0.186,
    0.095,
    0.086,
    0.069,
    0.14,
    0.081,
    0.159,
    0.091,
    0.074,
    0.159,
    0.06,
    0.112,
    0.179,
    0.034,
    0.451,
    0.081,
    0.13,
    0.084,
    0.1,
    0.057,
    0.088,
    0.111,
    0.073,
    0.102,
    0.07,
    0.075,
    0.21,
    0.148,
    0.052,
    0.114,
    0.1,
    0.073,
    0.037,
    0.115,
    0.195,
    0.079,
    0.21,
    0.072,
    0.01,
    0.092,
    0.135,
    0.052,
    0.13,
    0.064,
    0.715,
    0.061,
    0.8879,
    1,
    0
  ];
  let input2 = [
    0.076,
    0.1669,
    0.151,
    0.952,
    0.151,
    0.1498,
    0.286,
    0.1928,
    0.155,
    0.1067,
    0.272,
    0.1011,
    0.195,
    0.1248,
    0.137,
    0.1099,
    0.16,
    0.1255,
    0.193,
    0.1344,
    0.183,
    0.1204,
    0.193,
    0.867,
    0.152,
    0.1508,
    0.179,
    0.986,
    0.151,
    0.1271,
    0.203,
    0.2524,
    0.167,
    0.1239,
    0.149,
    0.1316,
    0.14,
    0.1567,
    0.268,
    0.2675,
    0.178,
    0.1213,
    0.192,
    0.1191,
    0.202,
    0.1231,
    0.151,
    0.1346,
    0.173,
    0.1233,
    0.148,
    0.1321,
    0.148,
    0.1374,
    0.206,
    0.1435,
    0.151,
    0.13,
    0.127,
    0.1287,
    0.228,
    0.1142,
    0.225,
    0.1457,
    0.24,
    0.1558,
    0.285,
    0.1301,
    0.247,
    0.1425,
    0.239,
    0.1148,
    0.391,
    0.1242,
    0.0231,
    0.1556,
    0.297,
    0.1678,
    0.299,
    0.1385,
    0.186,
    0.1184,
    0.174,
    0.1505,
    0.218,
    0.66237,
    1,
    1
  ];
  let input3 = [
    0.101,
    0.955,
    0.086,
    0.488,
    0.146,
    0.285,
    0.122,
    0.1563,
    0.11,
    0.077,
    0.138,
    0.155,
    0.126,
    0.625,
    0.127,
    0.461,
    0.119,
    0.924,
    0.144,
    0.2488,
    0.175,
    0.258,
    0.119,
    0.123,
    0.134,
    0.58,
    0.154,
    0.036,
    0.159,
    0.1005,
    0.129,
    0.2159,
    0.135,
    0.492,
    0.147,
    0.597,
    0.135,
    0.423,
    0.145,
    0.2183,
    0.15,
    0.253,
    0.11,
    0.255,
    0.072,
    0.411,
    0.123,
    0.089,
    0.125,
    0.701,
    0.135,
    0.2772,
    0.129,
    0.142,
    0.115,
    0.236,
    0.115,
    0.284,
    0.129,
    0.37,
    0.147,
    0.3642,
    0.168,
    0.103,
    0.12,
    0.389,
    0.183,
    0.359,
    0.116,
    0.3479,
    0.121,
    0.166,
    0.116,
    0.686,
    0.107,
    0.548,
    0.107,
    0.73,
    0.122,
    0.2839,
    0.123,
    0.267,
    0.111,
    0.07,
    0.076,
    0.40139,
    0,
    1
  ];

  net.train([
    {
      input: [...init_train_input],
      output: [0]
    },
    {
      input: [...input1],
      output: [1]
    },
    {
      input: [...input2],
      output: [2]
    },
    {
      input: [...input3],
      output: [3]
    }
  ]);

  // let arr = input1;
  // let result = [];
  // for (let i = 0; i < arr.length; i++) {
  //   for (let j = i + 1; j < arr.length; j++) {
  //     result.push([arr[i], arr[j]]);
  //   }
  // }

  // console.log("result", result);

  // let pairator = arr => {
  //   let result = [];
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     result.push([arr[i], arr[i + 1]]);
  //     i++;
  //   }
  //   return result;
  // };
  //
  // console.log("pairator(input1)", pairator(input1));
  // const trainingData = [
  //   [...pairator(init_train_input), [0, 0]],
  //   [...pairator(input1), [1, 1]],
  //   [...pairator(input2), [2, 2]],
  //   [...pairator(input3), [3, 3]]
  // ];
  //
  // net.train(trainingData, { log: true, errorThresh: 0.09 });

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

  let output = await net.run([...input1]); // [0.987]
  // let output = await net.run([...pairator(input3)]); // [0.987]
  console.log("output", JSON.stringify(output));
  // let output = net.run(["58", "026", "37"]); // [0.987]
  // console.log("output", JSON.stringify(output));
  // let output = net.run(["49", "000", "20"]); // [0.987]
  // console.log("output", output);
  res.end(JSON.stringify({ output, net: net.toJSON() }));
};

// export default handler;
export default withMongoConnect(handler);
