const { fetchAllUsers, fetchUserById } = require("../models/userModel");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  fetchUserById(userId)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
