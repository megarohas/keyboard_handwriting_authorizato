import withMongoConnect from "../../helpers/mongo_connector.js";
// import YOUR-SCHEMA from '../../../../models/SCHEMA-NAME.schema'

const handler = async ({ req, res, db }) => {
  const users = db.getTable("users");
  const db_users = await users.find().exec();
  res.end(JSON.stringify({ users: db_users }));
  // res.end(JSON.stringify({ users: [] }));
  return {};
};

export default withMongoConnect(handler);
