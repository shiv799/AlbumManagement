const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Token not provide", status: false });
    }
    const token = req.headers.authorization
      ? req.headers.authorization
      : req.body.headers.authorization;

    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token Expired", status: false });
      }
      return next();
    });
  } catch (error) {
    if (error) {
      return res.status(500).json({ message: error, status: false });
    }
  }
};

module.exports = verifyToken;
