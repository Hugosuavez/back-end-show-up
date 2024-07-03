const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../models/usersModel");

const secretKey = process.env.JWT_SECRET || "yourSecretKey";

exports.authenticate = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user.user_id, username: user.username },
        secretKey,
        { expiresIn: "24h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    next(err);
  }
};

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
