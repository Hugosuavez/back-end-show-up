const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { mockClient } = require("aws-sdk-client-mock");
const { uploadToS3 } = require("../../services/s3Service");

// Mock the S3 client
const s3Mock = mockClient(S3Client);

describe("s3Service Tests", () => {
  beforeAll(() => {
    s3Mock.on(PutObjectCommand).resolves({
      ETag: "mocked-etag",
    });
  });

  afterAll(() => {
    s3Mock.reset();
  });

  it("should upload a file to S3 and return the URL", async () => {
    const fileBuffer = Buffer.from("fake-image-content");
    const fileName = "test-image.png";
    const mimeType = "image/png";
    const username = "testuser";

    const result = await uploadToS3(fileBuffer, fileName, mimeType, username);

    const expectedUrl = `https://${
      process.env.AWS_BUCKET_NAME
    }.s3.amazonaws.com/${username}-${expect.any(String)}-${fileName}`;
    expect(result).toMatch(
      new RegExp(
        `^https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${username}-\\d+-${fileName}$`
      )
    );
    expect(s3Mock.calls()).toHaveLength(1);

    const call = s3Mock.calls()[0].args[0].input;
    expect(call).toHaveProperty("Bucket", process.env.AWS_BUCKET_NAME);
    expect(call).toHaveProperty(
      "Key",
      expect.stringMatching(new RegExp(`${username}-\\d+-${fileName}`))
    );
    expect(call).toHaveProperty("Body", fileBuffer);
    expect(call).toHaveProperty("ContentType", mimeType);
  });
});
