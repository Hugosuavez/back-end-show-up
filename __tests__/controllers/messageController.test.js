const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const messageController = require("../../controllers/messageController");
const { authenticateJWT } = require("../../controllers/authController");
const {
  sendMessage,
  getConversations,
  getConversationMessages,
} = require("../../models/messageModel");
const { getUserByUsername } = require("../../models/usersModel");

// Mock the model functions
jest.mock("../../models/messageModel");
jest.mock("../../models/usersModel");

const app = express();
app.use(express.json());

app.post("/api/messages", authenticateJWT, messageController.sendMessage);
app.get(
  "/api/conversations",
  authenticateJWT,
  messageController.getConversations
);
app.get(
  "/api/messages/:username",
  authenticateJWT,
  messageController.getConversationMessages
);

// Mock JWT secret key
const secretKey = "yourSecretKey"; // must match the secret key in authController

// Mock the environment variable
beforeAll(() => {
  process.env.JWT_SECRET = secretKey;
});

// Error handling middleware for tests
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

describe("messageController Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/messages", () => {
    it("should send a message", async () => {
      const mockUser = { user_id: 2, username: "recipient_user" };
      const mockMessage = {
        message_id: 1,
        sender_id: 1,
        recipient_id: 2,
        message: "Hello",
        created_at: new Date(),
      };
      getUserByUsername.mockResolvedValue(mockUser);
      sendMessage.mockResolvedValue(mockMessage);

      const token = jwt.sign({ id: 1, username: "sender_user" }, secretKey, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .post("/api/messages")
        .set("Authorization", token)
        .send({ recipient: "recipient_user", message: "Hello" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message_id: mockMessage.message_id,
        sender_id: mockMessage.sender_id,
        recipient_id: mockMessage.recipient_id,
        message: mockMessage.message,
        created_at: mockMessage.created_at.toISOString(),
      });
      expect(getUserByUsername).toHaveBeenCalledWith("recipient_user");
      expect(sendMessage).toHaveBeenCalledWith(1, 2, "Hello");
    });

    it("should return 400 for missing recipient or message", async () => {
      const token = jwt.sign({ id: 1, username: "sender_user" }, secretKey, {
        expiresIn: "1h",
      });

      let response = await request(app)
        .post("/api/messages")
        .set("Authorization", token)
        .send({ message: "Hello" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Recipient and message are required"
      );

      response = await request(app)
        .post("/api/messages")
        .set("Authorization", token)
        .send({ recipient: "recipient_user" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Recipient and message are required"
      );
    });

    it("should return 404 if recipient not found", async () => {
      getUserByUsername.mockResolvedValue(null);

      const token = jwt.sign({ id: 1, username: "sender_user" }, secretKey, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .post("/api/messages")
        .set("Authorization", token)
        .send({ recipient: "nonexistent_user", message: "Hello" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Recipient not found");
      expect(getUserByUsername).toHaveBeenCalledWith("nonexistent_user");
    });
  });

  describe("GET /api/conversations", () => {
    it("should return a list of conversations for the user", async () => {
      const mockConversations = [
        {
          user_id: 2,
          username: "user2",
          first_name: "First2",
          last_name: "Last2",
          email: "user2@example.com",
        },
        {
          user_id: 3,
          username: "user3",
          first_name: "First3",
          last_name: "Last3",
          email: "user3@example.com",
        },
      ];
      getConversations.mockResolvedValue(mockConversations);

      const token = jwt.sign({ id: 1, username: "user1" }, secretKey, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .get("/api/conversations")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockConversations);
      expect(getConversations).toHaveBeenCalledWith(1);
    });
  });

  describe("GET /api/messages/:username", () => {
    it("should return conversation messages with a specific user", async () => {
      const mockUser = { user_id: 2, username: "user2" };
      const mockMessages = [
        {
          message_id: 1,
          sender_id: 1,
          recipient_id: 2,
          message: "Hello",
          created_at: new Date(),
        },
        {
          message_id: 2,
          sender_id: 2,
          recipient_id: 1,
          message: "Hi",
          created_at: new Date(),
        },
      ];
      getUserByUsername.mockResolvedValue(mockUser);
      getConversationMessages.mockResolvedValue(mockMessages);

      const token = jwt.sign({ id: 1, username: "user1" }, secretKey, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .get("/api/messages/user2")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      const expectedMessages = mockMessages.map((msg) => ({
        ...msg,
        created_at: msg.created_at.toISOString(),
      }));
      expect(response.body).toEqual(expectedMessages);
      expect(getUserByUsername).toHaveBeenCalledWith("user2");
      expect(getConversationMessages).toHaveBeenCalledWith(1, 2);
    });

    it("should return 404 if the user not found", async () => {
      getUserByUsername.mockResolvedValue(null);

      const token = jwt.sign({ id: 1, username: "user1" }, secretKey, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .get("/api/messages/nonexistent_user")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "User not found");
      expect(getUserByUsername).toHaveBeenCalledWith("nonexistent_user");
    });
  });
});
