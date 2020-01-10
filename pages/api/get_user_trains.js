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
  console.log("get_user_trains");
  const trains = await db.getTable("trains");

  let trainer_id = req.body.user_id;
  trains
    .find({ trainer_id })
    .select()
    .exec((err, trains) => {
      if (err || !trains) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error" }));
      }

      res.end(JSON.stringify({ trains: trains.reverse() }));
    });
};

export default withMongoConnect(handler);
