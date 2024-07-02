const request = require("supertest");
const { app, server } = require("../app");
const ioClient = require("socket.io-client");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

let clientSocket;

beforeAll(async () => {
  await seed(testData);
  server.listen(9091, () => {
    clientSocket = ioClient(`http://localhost:9091`);
  });
});

afterAll(async () => {
  clientSocket.close();
  server.close();
  await db.end();
});

describe("Integration Tests", () => {
  describe("User Authentication", () => {
    test("should authenticate user and return a token", async () => {
      const response = await request(app)
        .post("/api/authenticate")
        .send({ username: "j_depp", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("should fail to authenticate with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/authenticate")
        .send({ username: "invalid_user", password: "invalid_password" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid username or password");
    });
  });

  describe("File Upload", () => {
    let token;

    beforeAll(async () => {
      const response = await request(app)
        .post("/api/authenticate")
        .send({ username: "j_depp", password: "password" });
      token = response.body.token;
    });

    test("should upload a file and return the URL", async () => {
      const response = await request(app)
        .post("/api/upload")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("fake-image-content"), "test-image.png");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "File uploaded successfully.");
      expect(response.body).toHaveProperty("location");
    });

    test("should return 400 if no file is uploaded", async () => {
      const response = await request(app)
        .post("/api/upload")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe("No files were uploaded.");
    });
  });

  describe("Real-time Messaging", () => {
    let token;
    let messages = [];

    beforeAll((done) => {
      clientSocket.on("connect", () => {
        clientSocket.on("receive_message", (message) => {
          messages.push(message);
        });
        done();
      });
    });

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/authenticate")
        .send({ username: "j_depp", password: "password" });
      token = response.body.token;
      messages = [];
    });

    test("should send and receive messages", (done) => {
      const testMessage = {
        sender_id: 1,
        recipient_id: 2,
        sender_type: "client",
        recipient_type: "entertainer",
        messageText: "Test message",
        booking_id: 1
      };

      clientSocket.emit("send_message", testMessage);

      setTimeout(() => {
        expect(messages.length).toBe(1);
        expect(messages[0]).toMatchObject(testMessage);
        done();
      }, 1000);
    });
  });
});