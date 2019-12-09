import withMongoConnect from "../../helpers/mongo_connector.js";
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  const users = db.getTable("users");
  let new_user_data = {
    name: req.body.name,
    email: req.body.email,
    password_hash: ""
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
