const path = require("path");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const { insertUserMedia } = require("../../models/userMediaModel");
const { uploadToS3 } = require("../../services/s3Service");
const fs = require("fs");
const { Readable } = require("stream");

// Mock the insertUserMedia function
jest.mock("../../models/userMediaModel");

// Mock the uploadToS3 function
jest.mock("../../services/s3Service");

const mockUser = { id: 1, username: "testuser" };
const secretKey = "yourSecretKey";

// Generate a mock JWT for testing
const generateMockJWT = () => {
  return jwt.sign(mockUser, secretKey, { expiresIn: "24h" });
};

// Helper function to create a readable stream from a buffer
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

describe("uploadController Tests", () => {
  beforeAll(() => {
    uploadToS3.mockResolvedValue("https://mocked-url.com/mock-image.png");

    insertUserMedia.mockResolvedValue({
      media_id: 1,
      url: "https://mocked-url.com/mock-image.png",
      user_id: mockUser.id,
      created_at: new Date(),
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if no file is uploaded", async () => {
    const token = generateMockJWT();
    const response = await request(app)
      .post("/api/upload")
      .set("Authorization", token);

    expect(response.status).toBe(400);
    expect(response.text).toBe("No files were uploaded.");
  });

  it("should upload an image, return the URL, and store it in the database", async () => {
    const token = generateMockJWT();
    const buffer = Buffer.from("fake-image-content");
    const stream = bufferToStream(buffer);

    const response = await request(app)
      .post("/api/upload")
      .set("Authorization", token)
      .attach("file", stream, "test-image.png"); // Use the in-memory stream

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "File successfully uploaded!"
    );
    expect(response.body.media).toHaveProperty(
      "url",
      "https://mocked-url.com/mock-image.png"
    );
    expect(response.body.media).toHaveProperty("user_id", mockUser.id);
  });
});
