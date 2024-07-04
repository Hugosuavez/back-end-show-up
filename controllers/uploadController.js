const { uploadToS3 } = require("../services/s3Service");
const { insertUserMedia } = require("../models/userMediaModel");

const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;

  try {
    const user = req.user;
    const fileUrl = await uploadToS3(
      file.data,
      file.name,
      file.mimetype,
      user.username
    );

    // Insert the file URL into the database
    const media = await insertUserMedia(fileUrl, user.id);

    res.status(200).send({
      message: "File successfully uploaded!",
      media,
    });
  } catch (error) {
    console.error("Error during file upload process:", error);
    res.status(500).send("Error during file upload process.");
  }
};

module.exports = { uploadFile };
