import withMongoConnect from "../../helpers/back/mongo_connector.js";
import JWTcheck from "../../helpers/back/auth_checker.js";
const handler = async ({ req, res }) => {
  JWTcheck({ req, res });
  res.end(JSON.stringify({ msg: "pong" }));
};

export default withMongoConnect(handler);
