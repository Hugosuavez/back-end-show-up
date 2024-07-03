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
const { checkCategoryIsValid } = require("../../models/categoriesModels");
const { checkLocationIsValid } = require("../../models/locationsModels");

jest.mock("../../models/entertainersModels");
jest.mock("../../models/categoriesModels");
jest.mock("../../models/locationsModels");

const app = express();
app.use(bodyParser.json());
app.get("/api/entertainers/:user_id", getEntertainerById);
app.get("/api/entertainers", getEntertainers);

describe("GET /api/entertainers/:user_id", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("200: responds with correct entertainer object without password and includes media as string array", async () => {
    const mockEntertainer = {
      user_id: 1,
      username: "j_depp",
      password: "hashedpassword",
      first_name: "Johnny",
      last_name: "Depp",
      email: "j.depp@gmail.com",
      profile_img_url:
        "https://cdn.britannica.com/89/152989-050-DDF277EA/Johnny-Depp-2011.jpg",
      user_type: "Entertainer",
      category: "Juggler",
      location: "London",
      entertainer_name: "Johnny the Juggler",
      description: "A master of balance and coordination...",
      price: 20,
      created_at: "2024-07-03T19:35:37.535Z",
      media: [
        "https://example.com/media1.jpg",
        "https://example.com/media2.jpg",
      ],
    };

    fetchEntertainerById.mockResolvedValue(mockEntertainer);

    const response = await request(app).get("/api/entertainers/1").expect(200);

    expect(response.body.entertainer).toMatchObject({
      user_id: 1,
      username: "j_depp",
      first_name: "Johnny",
      last_name: "Depp",
      email: "j.depp@gmail.com",
      profile_img_url:
        "https://cdn.britannica.com/89/152989-050-DDF277EA/Johnny-Depp-2011.jpg",
      user_type: "Entertainer",
      category: "Juggler",
      location: "London",
      entertainer_name: "Johnny the Juggler",
      description: "A master of balance and coordination...",
      price: 20,
      created_at: "2024-07-03T19:35:37.535Z",
    });
    expect(response.body.entertainer.media).toEqual([
      "https://example.com/media1.jpg",
      "https://example.com/media2.jpg",
    ]);
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

  test("200: responds with a list of entertainers and their media for valid location and category", async () => {
    const mockEntertainers = [
      { user_id: 1, username: "j_depp", password: "hashedpassword" },
      { user_id: 3, username: "d_radcliffe", password: "hashedpassword" },
    ];
    const mockMedia = [
      { url: "https://example.com/media1.jpg" },
      { url: "https://example.com/media2.jpg" },
    ];

    fetchEntertainers.mockResolvedValue(mockEntertainers);
    checkLocationIsValid.mockResolvedValue(true);
    checkCategoryIsValid.mockResolvedValue(true);
    fetchUserMediaByUserId.mockResolvedValue(mockMedia);

    const response = await request(app)
      .get("/api/entertainers?location=London&category=Juggler&date=2023-07-01")
      .expect(200);

    expect(fetchEntertainers).toHaveBeenCalledWith(
      "London",
      "Juggler",
      "2023-07-01"
    );
    expect(checkLocationIsValid).toHaveBeenCalledWith("London");
    expect(checkCategoryIsValid).toHaveBeenCalledWith("Juggler");

    expect(response.body.entertainers).toEqual([
      {
        user_id: 1,
        username: "j_depp",
        media: [
          "https://example.com/media1.jpg",
          "https://example.com/media2.jpg",
        ],
      },
      {
        user_id: 3,
        username: "d_radcliffe",
        media: [
          "https://example.com/media1.jpg",
          "https://example.com/media2.jpg",
        ],
      },
    ]);
  });
});
