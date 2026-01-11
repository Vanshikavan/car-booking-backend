const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        msg: "Token missing after Bearer",
      });
    }

    const verify = jwt.verify(token, process.env.SECRET);

    req.user = {
      userId: verify.userId,
      username: verify.username,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Error validating user",
    });
  }
}

module.exports = auth;
