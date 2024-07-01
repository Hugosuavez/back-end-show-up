const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "show-up-northcoders";

const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const filePath = path.join(__dirname, file.name);

  // Move the file to a temporary location
  file.mv(filePath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now().toString()}-${path.basename(filePath)}`,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      fs.unlinkSync(filePath); // Clean up the local file after upload
      res
        .status(200)
        .send({
          message: "File uploaded successfully.",
          location: data.Location,
        });
    } catch (error) {
      fs.unlinkSync(filePath); // Clean up the local file on error
      res.status(500).send(error);
    }
  });
};

module.exports = { uploadFile };
