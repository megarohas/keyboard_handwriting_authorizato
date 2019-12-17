import withMongoConnect from "../../helpers/back/mongo_connector.js";
let brain = require("brain.js");
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  try {
    let nets = db.getTable("nets");
    let db_nets = await nets.find().exec();
    let last_created_net =
      db_nets.length > 0 ? db_nets[db_nets.length - 1] : { phrase: "" };
    res.end(JSON.stringify({ phrase: last_created_net.phrase }));
  } catch (e) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect(handler);
