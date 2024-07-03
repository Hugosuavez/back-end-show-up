const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { authenticateJWT } = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "yourSecretKey";

let token = "";

afterAll(() => {
  return db.end();
});

beforeEach(async () => {
  await seed(data);

  const user = { id: 1, username: "testuser" };
  token = jwt.sign(user, secretKey, { expiresIn: "1h" });
});

describe("GET /api/entertainers", () => {
  test("200: responds with an array objects with correct properties", () => {
    return request(app)
      .get("/api/entertainers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(4);
        body.entertainers.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            profile_img_url: expect.any(String),
            user_type: "Entertainer",
            category: expect.any(String),
            location: expect.any(String),
            entertainer_name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            url: expect.any(String),
            media_id: expect.any(Number),
          });
        });
      });
  });

  test("404: route not found", () => {
    return request(app)
      .get("/api/nonsense")
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: route not found");
      });
  });
});

describe("GET /api/entertainers?location", () => {
  test("200: returns entertainers in correct location", () => {
    return request(app)
      .get("/api/entertainers?location=London")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            profile_img_url: expect.any(String),
            user_type: "Entertainer",
            category: expect.any(String),
            location: "London",
            entertainer_name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            url: expect.any(String),
            media_id: expect.any(Number),
          });
        });
      });
  });
  test("404: invalid location", () => {
    return request(app)
      .get("/api/entertainers?location=lanchesterpool")
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/entertainers?category", () => {
  test("200: returns entertainers in correct category", () => {
    return request(app)
      .get("/api/entertainers?category=Juggler")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(2);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            profile_img_url: expect.any(String),
            user_type: "Entertainer",
            category: "Juggler",
            location: expect.any(String),
            entertainer_name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            url: expect.any(String),
            media_id: expect.any(Number),
          });
        });
      });
  });
  test("404: invalid category", () => {
    return request(app)
      .get("/api/entertainers?category=weapon")
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/entertainers?date", () => {
  test("200: returns entertainers available on that date", () => {
    return request(app)
      .get("/api/entertainers?date=2024-07-01")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            profile_img_url: expect.any(String),
            user_type: "Entertainer",
            category: expect.any(String),
            location: expect.any(String),
            entertainer_name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            url: expect.any(String),
            media_id: expect.any(Number),
          });
        });
      });
  });
  test("404: invalid date", () => {
    return request(app)
      .get("/api/entertainers?date=chips")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/entertainers/:user_id", () => {
  test("200: responds with correct entertainer object", () => {
    return request(app)
      .get("/api/entertainers/2")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer).toMatchObject({
          user_id: 2,
          username: expect.any(String),
          password: expect.any(String),
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String),
          profile_img_url: expect.any(String),
          user_type: "Entertainer",
          category: expect.any(String),
          location: expect.any(String),
          entertainer_name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          url: expect.any(String),
          media_id: expect.any(Number),
        });
      });
  });
  test("404: Not Found", () => {
    return request(app)
      .get("/api/entertainers/9999")
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/entertainers/biro")
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET /locations", () => {
  test("200: returns an array of location objects", () => {
    return request(app)
      .get("/api/locations")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        body.forEach((location) => {
          expect(location).toMatchObject({
            location: expect.any(String),
          });
        });
      });
  });
});

describe("GET /categories", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        body.forEach((category) => {
          expect(category).toMatchObject({
            category: expect.any(String),
          });
        });
      });
  });
});
