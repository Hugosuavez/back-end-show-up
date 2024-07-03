const { checkCategoryIsValid } = require("../models/categoriesModels");
const {
  fetchEntertainers,
  fetchEntertainerById,
  fetchUserMediaByUserId
} = require("../models/entertainersModels");
const { checkLocationIsValid } = require("../models/locationsModels");

exports.getEntertainers = async (req, res, next) => {
  try {
    const { location, category, date } = req.query;

    const promises = [fetchEntertainers(location, category, date)];

    if (location) {
      promises.push(checkLocationIsValid(location));
    }
    if (category) {
      promises.push(checkCategoryIsValid(category));
    }

    const resolvedPromises = await Promise.all(promises);
    const entertainers = resolvedPromises[0];

    const entertainersWithMedia = await Promise.all(entertainers.map(async (user) => {
      const { password, ...userWithoutPassword } = user;
      const media = await fetchUserMediaByUserId(user.user_id);
      return { ...userWithoutPassword, media };
    }));

    res.status(200).send({ entertainers: entertainersWithMedia });
  } catch (err) {
    next(err);
  }
};

exports.getEntertainerById = (req, res, next) => {
  const { user_id } = req.params;

  Promise.all([fetchEntertainerById(user_id), fetchUserMediaByUserId(user_id)])
    .then(([entertainer, media]) => {
      if (entertainer) {
        const { password, ...entertainerWithoutPassword } = entertainer;
        entertainerWithoutPassword.media = media;
        res.status(200).send({ entertainer: entertainerWithoutPassword });
      } else {
        res.status(404).send({ error: "Entertainer not found" });
      }
    })
    .catch(next);
};
