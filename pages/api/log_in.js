import withMongoConnect from "../../helpers/back/mongo_connector.js";
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");

const handler = async ({ req, res, db }) => {
  console.log("req.body", req.body);
  const users = db.getTable("users");
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.end(JSON.stringify({ status: "error" }));
  } else {
    let email = req.body.email;
    let password = req.body.password;
    users
      .findOne({ email })
      .select("password_hash")
      .exec((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error" }));
        }
        if (!user) {
          res.statusCode = 401;
          res.end(JSON.stringify({ status: "error" }));
        }
        bcrypt.compare(password, user.password_hash, (err, valid) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ status: "error" }));
          }
          if (!valid) {
            res.statusCode = 100;
            res.end(JSON.stringify({ status: "error" }));
          }
          let token = jwt.encode({ email }, "lhbcyz");
          res.end(JSON.stringify({ token }));
        });
      });
  }
};

export default withMongoConnect(handler);
