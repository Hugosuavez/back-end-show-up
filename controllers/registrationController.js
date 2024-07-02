const { addUser, isUsernameTaken } = require("../models/registrationModel");

exports.registerUser = async (req, res, next) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    user_type,
    category,
    location,
    entertainer_name,
    description,
    price,
  } = req.body;

  // Validate required fields
  if (
    !username ||
    !password ||
    !first_name ||
    !last_name ||
    !email ||
    !user_type
  ) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    // Check if username is already taken
    const usernameTaken = await isUsernameTaken(username);
    if (usernameTaken) {
      return res.status(409).send({ error: "Username already taken" });
    }

    // Add user to the database
    const user = await addUser({
      username,
      password,
      first_name,
      last_name,
      email,
      user_type,
      category,
      location,
      entertainer_name,
      description,
      price,
    });

    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};

exports.checkUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const usernameTaken = await isUsernameTaken(username);
    res.status(200).send({ usernameTaken });
  } catch (err) {
    next(err);
  }
};
