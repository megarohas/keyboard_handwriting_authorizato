import withMongoConnect from "../../helpers/back/mongo_connector.js";
import JWTcheck from "../../helpers/back/auth_checker.js";
let random_namer = require("random-name");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  // JWTcheck({ req, res });
  const users = db.getTable("users");
  let name = random_namer.first().toLowerCase();
  let new_user_data = {
    name,
    email: `${name}@gmail.com`,
    password_hash: "",
    token: jwt.encode({ email: `${name}@gmail.com` }, "lhbcyz")
  };
  let new_user = new users(new_user_data);
  await new_user.save();
  res.end(JSON.stringify({ new_user: new_user_data }));
  return {};
};

export default withMongoConnect(handler);
