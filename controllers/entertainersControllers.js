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
      const mediaObjects = await fetchUserMediaByUserId(user.user_id);
      const media = mediaObjects.map(mediaObj => mediaObj.url);
      return { ...userWithoutPassword, media };
    }));

    res.status(200).send({ entertainers: entertainersWithMedia });
  } catch (err) {
    next(err);
  }
};

exports.getEntertainerById = (req, res, next) => {
  const { user_id } = req.params;
  Promise.all([fetchEntertainerById(user_id)])
    .then(([entertainer]) => {
      if (entertainer) {
        const { password, ...entertainerWithoutPassword } = entertainer;
        res.status(200).send({ entertainer: entertainerWithoutPassword });
      } else {
        res.status(404).send({ error: "Entertainer not found" });
      }
    })
    .catch(next);
};
