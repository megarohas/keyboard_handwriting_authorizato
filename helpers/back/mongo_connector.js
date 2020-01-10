import mongoose from "mongoose";

import { users_schema, nets_schema, trains_schema } from "../../db/schema.js";

const withMongoConnect = handler => async (req, res) => {
  try {
    // console.log("mongoose.connection:", mongoose.connection);
    if (!mongoose.connection.readyState) {
      console.log("mupa1.5");
      let uri =
        // "mongodb://admin:admin@cluster-shard-00-02-0jxmf.mongodb.net:27017/keyboard_handwriting_authorizator?retryWrites=true&w=majority";
        // "mongodb+srv://admin:admin@cluster-shard-00-00-0jxmf.mongodb.net:27017,cluster-shard-00-01-0jxmf.mongodb.net:27017,cluster-shard-00-02-0jxmf.mongodb.net:27017/keyboard_handwriting_authorizator?retryWrites=true&w=majority";
        "mongodb+srv://megarohas:VFpfafrf14882281369@cluster0-0jxmf.gcp.mongodb.net/keyboard_handwriting_authorizator?retryWrites=true&w=majority";
      let check = await mongoose.connect(uri, {
        useNewUrlParser: true,
        autoIndex: false
      });
      // .catch(error => console.log(error));
    }
    // console.log("check", nets_schema);
    let getSchema = name => {
      console.log("getSchema *************:", name);
      if (name == "users") return users_schema;
      if (name == "nets") return nets_schema;
      if (name == "trains") return trains_schema;
    };
    let modelAlreadyDeclared = name => {
      try {
        mongoose.model(name);
        return true;
      } catch (e) {
        return false;
      }
    };

    let getTable = name => {
      return !modelAlreadyDeclared(name)
        ? mongoose.model(name, getSchema(name))
        : mongoose.models[name];
    };
    return handler({
      req,
      res,
      db: {
        ...mongoose,
        getTable
      }
    });
  } catch (e) {
    console.log("e", e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error", error: e }));
  }
};

export default withMongoConnect;
