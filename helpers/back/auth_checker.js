let jwt = require("jwt-simple");

const JWTcheck = ({ req, res }) => {
  if (!req.headers["authorization"]) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ status: "error" }));
  }
  try {
    jwt.decode(req.headers["authorization"], "lhbcyz");
  } catch (err) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ status: "error" }));
  }
};
export default JWTcheck;
