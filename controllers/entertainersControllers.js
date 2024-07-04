const { checkCategoryIsValid } = require("../models/categoriesModels");
const {
  fetchEntertainers,
  fetchEntertainerById,
  fetchUserMediaByUserId,
  updateEntertainersById,
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

    const entertainersWithMedia = await Promise.all(
      entertainers.map(async (user) => {
        const { password, ...userWithoutPassword } = user;
        const mediaObjects = await fetchUserMediaByUserId(user.user_id);
        const media = mediaObjects.map((mediaObj) => mediaObj.url);
        return { ...userWithoutPassword, media };
      })
    );

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

exports.patchEntertainerById = (req, res, next) => {
  const { user_id } = req.params;
  const { category, location, entertainer_name, description, price, email } =
    req.body;

  if (
    !category &&
    !location &&
    !entertainer_name &&
    !description &&
    !price &&
    !email
  ) {
    return res.status(400).json({ error: "missing required fields" });
  }

  const errors = {};

  if (typeof price !== "undefined" && typeof price !== "number") {
    errors.price = "Incorrect data type";
  }
  if (typeof description !== "undefined" && typeof description !== "string") {
    errors.description = "Incorrect data type";
  }
  if (
    typeof entertainer_name !== "undefined" &&
    typeof entertainer_name !== "string"
  ) {
    errors.entertainer_name =
      "Incorrect data type";
  }
  if (typeof location !== "undefined" && typeof location !== "string") {
    errors.location = "Incorrect data type";
  }

  const validLocations = ["London", "Oxford", "Manchester", "Birmingham", "Leeds", "Liverpool", "Newcastle"];
  if (typeof location === "string" && !validLocations.includes(location)) {
    errors.location = "This location is COMING SOON!";
  }

  if (typeof category !== "undefined" && typeof category !== "string") {
    errors.category = "Incorrect data type";
  }

  const validCategories = ["Juggler", "Violinist", "Musicians", "Comedians", "Look-a-likes"];
  if (typeof category === "string" && !validCategories.includes(category)) {
    errors.location = "This category is COMING SOON!";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: errors });
  }

  updateEntertainersById(
    user_id,
    category,
    location,
    entertainer_name,
    description,
    price,
    email
  )
    .then((updatedEntertainer) => {
      res.status(200).json({ entertainer: updatedEntertainer });
    })
    .catch(next);
};
