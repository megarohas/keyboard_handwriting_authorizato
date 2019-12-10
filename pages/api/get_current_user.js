import withMongoConnect from "../../helpers/back/mongo_connector.js";
import JWTcheck from "../../helpers/back/auth_checker.js";
// import YOUR-SCHEMA from '../../../../models/SCHEMA-NAME.schema'

const handler = async ({ req, res, db }) => {
  // JWTcheck({ req, res });
  // const users = db.getTable("users");
  // const db_users = await users.find().exec();
  // res.end(JSON.stringify({ users: db_users }));
  // // res.end(JSON.stringify({ users: [] }));
  // return {};
  console.log("get_current_user");
  const users = db.getTable("users");
  if (!req.body.token) {
    res.statusCode = 400;
    res.end(JSON.stringify({ status: "error" }));
  } else {
    let token = req.body.token;
    users
      .findOne({ token })
      .select()
      .exec((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error" }));
        }
        if (!user) {
          res.statusCode = 401;
          res.end(JSON.stringify({ status: "error" }));
        }

        res.end(JSON.stringify({ user }));
      });
  }
};

export default withMongoConnect(handler);
