import mongoose from "mongoose";

import { users_schema } from "../../db/schema.js";

const withMongoConnect = handler => async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      console.log("mupa1.5");
      const uri =
        "mongodb+srv://megarohas:VFpfafrf14882281369@cluster-0jxmf.mongodb.net/keyboard_handwriting_authorizator?retryWrites=true&w=majority";
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        autoIndex: false
      });
    }
    let getSchema = name => {
      if ((name = "users")) return users_schema;
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
    res.statusCode = 500;
    return res.end(JSON.stringify({ status: "error" }));
  }
};

export default withMongoConnect;
