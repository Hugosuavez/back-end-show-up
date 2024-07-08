const { getUserByUsername } = require("../models/usersModel");
const { fetchUserMediaByUserId } = require("../models/entertainersModels");

exports.getProfile = async (req, res, next) => {
  const { username } = req.user; // username from JWT

  try {
    const user = await getUserByUsername(username);

    if (user) {
      // Remove password and null fields for Client from the user object before sending the response
      const { password, ...userWithoutPassword } = user;
      if (userWithoutPassword.user_type === "Client") {
        delete userWithoutPassword.category;
        delete userWithoutPassword.location;
        delete userWithoutPassword.entertainer_name;
        delete userWithoutPassword.description;
        delete userWithoutPassword.price;
      }

      // Fetch user media
      const mediaObjects = await fetchUserMediaByUserId(user.user_id);
      const media = mediaObjects.map((mediaObj) => mediaObj.url);

      // Combine user profile with media
      const userProfileWithMedia = { ...userWithoutPassword, media };

      res.status(200).send(userProfileWithMedia);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};
