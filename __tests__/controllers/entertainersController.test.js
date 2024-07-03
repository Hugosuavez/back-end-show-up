const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const {
  getEntertainerById,
  getEntertainers,
} = require("../../controllers/entertainersControllers");
const {
  fetchEntertainerById,
  fetchEntertainers,
  fetchUserMediaByUserId,
} = require("../../models/entertainersModels");

jest.mock("../../models/entertainersModels");

const app = express();
app.use(bodyParser.json());
app.get("/api/entertainers/:user_id", getEntertainerById);
app.get("/api/entertainers", getEntertainers);

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
      media: expect.any(Array),
    });
    expect(response.body.entertainer.media).toEqual(mockMedia);
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

describe("GET /api/entertainers", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("200: responds with an array of entertainer objects without passwords and includes media", async () => {
    const mockEntertainers = [
      {
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
      },
      {
        user_id: 2,
        username: "a_smith",
        password: "hashedpassword",
        first_name: "Anna",
        last_name: "Smith",
        email: "a.smith@gmail.com",
        profile_img_url: "",
        user_type: "Entertainer",
        category: "Singer",
        location: "Manchester",
        entertainer_name: "Anna the Singer",
        description: "A master of singing...",
        price: 30,
        created_at: "2024-07-03T19:35:37.535Z",
      },
    ];

    const mockMedia1 = [
      { url: "https://example.com/media1.jpg" },
      { url: "https://example.com/media2.jpg" },
    ];

    const mockMedia2 = [
      { url: "https://example.com/media3.jpg" },
      { url: "https://example.com/media4.jpg" },
    ];

    fetchEntertainers.mockResolvedValue(mockEntertainers);
    fetchUserMediaByUserId
      .mockResolvedValueOnce(mockMedia1)
      .mockResolvedValueOnce(mockMedia2);

    const response = await request(app).get("/api/entertainers").expect(200);

    expect(response.body.entertainers).toHaveLength(2);

    expect(response.body.entertainers[0]).toMatchObject({
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
      media: expect.any(Array),
    });
    expect(response.body.entertainers[0].media).toEqual(mockMedia1);
    expect(response.body.entertainers[0]).not.toHaveProperty("password");

    expect(response.body.entertainers[1]).toMatchObject({
      user_id: 2,
      username: "a_smith",
      first_name: "Anna",
      last_name: "Smith",
      email: "a.smith@gmail.com",
      profile_img_url: "",
      user_type: "Entertainer",
      category: "Singer",
      location: "Manchester",
      entertainer_name: "Anna the Singer",
      description: "A master of singing...",
      price: 30,
      created_at: "2024-07-03T19:35:37.535Z",
      media: expect.any(Array),
    });
    expect(response.body.entertainers[1].media).toEqual(mockMedia2);
    expect(response.body.entertainers[1]).not.toHaveProperty("password");
  });
});
