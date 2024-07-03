const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const {
  getEntertainerById,
} = require("../../controllers/entertainersControllers");
const {
  fetchEntertainerById,
  fetchUserMediaByUserId,
} = require("../../models/entertainersModels");

jest.mock("../../models/entertainersModels");

const app = express();
app.use(bodyParser.json());
app.get("/api/entertainers/:user_id", getEntertainerById);

describe("GET /api/entertainers/:user_id", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("200: responds with correct entertainer object without password and includes media", async () => {
    const mockEntertainer = {
      user_id: 1,
      username: "j_depp",
      password: "hashedpassword",
      first_name: "Johnny",
      last_name: "Depp",
      email: "j.depp@gmail.com",
      profile_img_url: "",
      user_type: "Entertainer",
      category: "Juggler",
      location: "London",
      entertainer_name: "Johnny the Juggler",
      description: "A master of balance and coordination...",
      price: 20,
      created_at: "2024-07-03T19:35:37.535Z",
    };

    const mockMedia = [
      { url: "https://example.com/media1.jpg" },
      { url: "https://example.com/media2.jpg" },
    ];

    fetchEntertainerById.mockResolvedValue(mockEntertainer);
    fetchUserMediaByUserId.mockResolvedValue(mockMedia);

    const response = await request(app).get("/api/entertainers/1").expect(200);

    expect(response.body.entertainer).toMatchObject({
      user_id: 1,
      username: "j_depp",
      first_name: "Johnny",
      last_name: "Depp",
      email: "j.depp@gmail.com",
      profile_img_url: "",
      user_type: "Entertainer",
      category: "Juggler",
      location: "London",
      entertainer_name: "Johnny the Juggler",
      description: "A master of balance and coordination...",
      price: 20,
      created_at: "2024-07-03T19:35:37.535Z",
      media: mockMedia,
    });
    expect(response.body.entertainer).not.toHaveProperty("password");
  });

  test("404: responds with error if entertainer not found", async () => {
    fetchEntertainerById.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/entertainers/9999")
      .expect(404);

    expect(response.body).toEqual({ error: "Entertainer not found" });
  });
});
