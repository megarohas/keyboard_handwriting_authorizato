import withMongoConnect from "../../helpers/back/mongo_connector.js";
import JWTcheck from "../../helpers/back/auth_checker.js";
// import YOUR-SCHEMA from '../../../../models/SCHEMA-NAME.schema'

const handler = async ({ req, res, db }) => {
  JWTcheck({ req, res });
  const users = db.getTable("users");
  const db_users = await users.find().exec();
  res.end(JSON.stringify({ users: db_users }));
  // res.end(JSON.stringify({ users: [] }));
  return {};
};

export default withMongoConnect(handler);
