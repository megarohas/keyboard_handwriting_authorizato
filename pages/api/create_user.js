import withMongoConnect from "../../helpers/mongo_connector.js";
let random_namer = require("random-name");

const handler = async ({ req, res, db }) => {
  const users = db.getTable("users");
  let name = random_namer.first().toLowerCase();
  let new_user_data = {
    name,
    email: `${name}@gmail.com`,
    password_hash: ""
  };
  let new_user = new users(new_user_data);
  await new_user.save();
  res.end(JSON.stringify({ new_user: new_user_data }));
  return {};
};

export default withMongoConnect(handler);
