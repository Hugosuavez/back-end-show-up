const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const uploadToS3 = async (fileBuffer, fileName, mimeType, username) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${username}-${Date.now().toString()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
};

module.exports = { uploadToS3 };
