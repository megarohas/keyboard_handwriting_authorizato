import withMongoConnect from "../../helpers/back/mongo_connector.js";
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  let users = db.getTable("users");
  let db_users = await users.find().exec();

  let last_created_user =
    db_users.length > 0 ? db_users[db_users.length - 1] : { id: "-1" };

  let new_user_data = {
    name: req.body.name,
    email: req.body.email,
    password_hash: "",
    token: jwt.encode({ email: req.body.email }, "lhbcyz"),
    id: (parseInt(last_created_user.id) + 1).toString()
  };
  return bcrypt.hash(req.body.password, 10, (err, hash) => {
    new_user_data.password_hash = hash;
    let new_user = new users(new_user_data);

    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ status: "error" }));
    } else {
      new_user.save(err => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error" }));
          // res.end(JSON.stringify({ new_user: new_user_data }));
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify({ new_user: new_user_data }));
        }
      });
    }
  });
};

export default withMongoConnect(handler);
