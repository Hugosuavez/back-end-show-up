const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsData = require("../endpoints.json");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "yourSecretKey";

let token = "";

afterAll(() => {
  return db.end();
});

beforeEach(async () => {
  await seed(data);

  const user = { id: 1, username: "j_depp" };
  token = jwt.sign(user, secretKey, { expiresIn: "24h" });
});

describe("GET /api/entertainers", () => {
  test("200: responds with an array objects with correct properties", () => {
    return request(app)
      .get("/api/entertainers")
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(4);
        body.entertainers.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
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
          });
        });
      });
  });

  test("404: route not found", () => {
    return request(app)
      .get("/api/nonsense")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
          });
        });
      });
  });
  test("404: invalid location", () => {
    return request(app)
      .get("/api/entertainers?location=lanchesterpool")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(2);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
          });
        });
      });
  });
  test("404: invalid category", () => {
    return request(app)
      .get("/api/entertainers?category=weapon")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
      .get("/api/entertainers/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer).toMatchObject({
          user_id: 1,
          username: expect.any(String),
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
          media: expect.any(Array),
        });
        expect(body.entertainer.media).toHaveLength(2);
      });
  });
  test("404: Not Found", () => {
    return request(app)
      .get("/api/entertainers/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/entertainers/biro")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET /api/entertainers", () => {
  test("200: responds with an array objects with correct properties", () => {
    return request(app)
      .get("/api/entertainers")
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(4);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
            media: expect.any(Array),
          });
          expect(entertainer).not.toHaveProperty("password");
        });
      });
  });

  test("404: route not found", () => {
    return request(app)
      .get("/api/nonsense")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
            media: expect.any(Array),
          });
          expect(entertainer).not.toHaveProperty("password");
        });
      });
  });
  test("404: invalid location", () => {
    return request(app)
      .get("/api/entertainers?location=lanchesterpool")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(2);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
            media: expect.any(Array),
          });
          expect(entertainer).not.toHaveProperty("password");
        });
      });
  });
  test("404: invalid category", () => {
    return request(app)
      .get("/api/entertainers?category=weapon")
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainers).toHaveLength(3);
        body.entertainers.forEach((entertainer) => {
          expect(entertainer).toMatchObject({
            username: expect.any(String),
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
            media: expect.any(Array),
          });
          expect(entertainer).not.toHaveProperty("password");
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
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer).toMatchObject({
          user_id: 2,
          username: expect.any(String),
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
          media: expect.any(Array),
        });
        expect(body.entertainer).not.toHaveProperty("password");
      });
  });
  test("404: Not Found", () => {
    return request(app)
      .get("/api/entertainers/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/entertainers/biro")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET /api/locations", () => {
  test("200: returns an array of location objects", () => {
    return request(app)
      .get("/api/locations")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy('location')
        expect(body).toHaveLength(7);
        body.forEach((location) => {
          expect(location).toMatchObject({
            location: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/categories", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy('category')
        expect(body).toHaveLength(5);
        body.forEach((category) => {
          expect(category).toMatchObject({
            category: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/me", () => {
  test("200: returns the currently authenticated users profile", () => {
    return request(app)
      .get("/api/me")
      .set("Authorization", `${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          category: expect.any(String),
          created_at: expect.any(String),
          description: expect.any(String),
          email: expect.any(String),
          entertainer_name: expect.any(String),
          first_name: expect.any(String),
          last_name: expect.any(String),
          location: expect.any(String),
          price: expect.any(Number),
          profile_img_url: expect.any(String),
          user_id: expect.any(Number),
          user_type: expect.any(String),
          username: expect.any(String),
        });
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object containing descriptions of all other endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsData);
      });
  });
});

describe("POST /api/bookings", () => {
  test("201: adds a new booking to the bookings list", () => {
    const newBooking = {
      user_id: 1,
      entertainer_id: 2,
      booking_date: new Date().toISOString(),
      event_date: "2024-07-01",
      event_details: "Leaving Drinks",
      address: "Upper Ground, London",
    };

    return request(app)
      .post("/api/bookings")
      .set('Authorization', `${token}`)
      .send(newBooking)
      .expect(201)
      .then(({ body }) => {
        expect(Object.keys(body.booking)).toHaveLength(8);
        expect(body.booking.user_id).toBe(newBooking.user_id);
        expect(body.booking.entertainer_id).toBe(newBooking.entertainer_id);
        expect(body.booking.event_date).toBe(newBooking.event_date);
        expect(body.booking.booking_date).toBe(newBooking.booking_date);
        expect(body.booking.event_details).toBe(newBooking.event_details);
        expect(body.booking.address).toBe(newBooking.address);
        expect(body.booking.status).toBe('pending')
      });
  });
  test("404: Not found when path is incorrect", () => {
    const newBooking = {
      user_id: 1,
      entertainer_id: 2,
      booking_date: new Date().toISOString(),
      event_date: "2024-07-01",
      event_details: "Leaving Drinks",
      address: "Upper Ground, London",
    };

    return request(app)
      .post("/api/nonsense")
      .set('Authorization', `${token}`)
      .send(newBooking)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: route not found");
      });
  });
  test("400: Bad Request failing schema validation", () => {
    const newBooking = {
      user_id: 1,
      entertainer_id: 2,
      booking_date: 77,
      event_date: 77,
      event_details: 78,
      address: "Upper Ground, London",
    };
  });
});

describe("GET /api/bookings", () => {
  test("200: responds with an array objects with correct properties", () => {
    return request(app)
      .get("/api/bookings")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings).toHaveLength(2);
        body.bookings.forEach((booking) => {
          expect(booking).toMatchObject({
            user_id: expect.any(Number),
            entertainer_id: expect.any(Number),
            booking_date: expect.any(String),
            event_date: expect.any(String),
            event_details: expect.any(String),
            address: expect.any(String),
            status: expect.any(String)
          });
        });
      });
  });

  test("404: route not found", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: route not found");
      });
  });
});

describe("GET /api/bookings/:booking_id", () => {
  test("200: responds with correct booking object", () => {
    return request(app)
      .get("/api/bookings/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.booking).toMatchObject({
          user_id: expect.any(Number),
          entertainer_id: expect.any(Number),
          booking_date: expect.any(String),
          event_date: expect.any(String),
          event_details: expect.any(String),
          address: expect.any(String),
          status: expect.any(String)
        });
      });
  });
  test("404: Not Found", () => {
    return request(app)
      .get("/api/bookings/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Booking not found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/bookings/biro")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("PATCH /api/entertainers/:user_id", () => {
  const userId = 1;

  test("PATCH:200 updates category", () => {
    const patchObj = { category: "Violinist" };
    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.category).toBe(patchObj.category);
      });
  });

  test("PATCH:200 updates location", () => {
    const patchObj = { location: "Liverpool" };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.location).toBe(patchObj.location);
      });
  });

  test("PATCH:200 updates entertainer_name", () => {
    const patchObj = { entertainer_name: "Gareth Southgate" };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.entertainer_name).toBe(
          patchObj.entertainer_name
        );
      });
  });

  test("PATCH:200 updates description", () => {
    const patchObj = {
      description:
        "a respected English football manager and former player known for my calm demeanor, tactical acumen, and dedication to nurturing young talent.",
    };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.description).toBe(patchObj.description);
      });
  });

  test("PATCH:200 updates price", () => {
    const patchObj = { price: 850 };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.price).toBe(patchObj.price);
      });
  });

  test("PATCH:200 updates email", () => {
    const patchObj = { email: "gareth.southgate@england.com" };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.entertainer.email).toBe(patchObj.email);
      });
  });

  test("PATCH:400 returns error for incorrect type in body", () => {
    const patchObj = {
      price: "850",
      description: 231,
      entertainer_name: 123,
      location: 2331,
      category: 12312,
    };

    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toMatchObject({
          price: "Incorrect data type",
          description: "Incorrect data type",
          entertainer_name: "Incorrect data type",
          location: "Incorrect data type",
          category: "Incorrect data type",
        });
      });
  });
  test("PATCH:400 returns error for unknown location", () => {
    const patchObj = { location: "Glasgow" };
    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toMatchObject({
          location: "This location is COMING SOON!",
        });
      });
  });
  test("PATCH:400 returns error for unknown category", () => {
    const patchObj = { category: "Motorist" };
    return request(app)
      .patch(`/api/entertainers/${userId}`)
      .send(patchObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toMatchObject({
          location: "This category is COMING SOON!",
        });
      });
  });
});

describe('DELETE /api/entertainers/:user_id', () => {
  test('DELETE:204 deletes the user stated in the user id', () => { 
      const userId = 1;
      return request(app)
      .delete(`/api/entertainers/${userId}`)
      .expect(204)
  })
  test('DELETE:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
      const userId = 9292;
      return request(app)
      .delete(`/api/entertainers/${userId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(`404: route not found`);
    });
    });
    test('DELETE:400 sends an appropriate status and error message when given an invalid user id', () => {
      const userId = "Thats all right with me ";
      return request(app)
      .delete(`/api/entertainers/${userId}`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('400: Bad Request');
        });
    });
})

describe('GET /api/availability/:entertainer_id', () => {

  test('200: responds with availability of entertainer based on entertainer_id', () => {
    return request(app)
    .get('/api/availability/1')
    .expect(200)
    .then(({ body }) => {
      expect(body.availability).toHaveLength(5);
      body.availability.forEach((date) => {
        expect(date).toMatchObject({
          entertainer_id: expect.any(Number),
          date: expect.any(String), // coflicts with DATE type in PSQL
          available: expect.any(Boolean)
        })
      })
    })
  })
  test("404: Not Found", () => {
    return request(app)
      .get("/api/availability/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Booking not found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/availability/biro")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
} )

describe("PATCH /api/availability/:entertainer_id", () => {
  test("PATCH: 200 updates availability", () => {
    const patchObj = { date: "2024-07-01", available: false};
    return request(app)
    .patch("/api/availability/1")
    .send(patchObj)
    .expect(200)
    .then(({body}) => {
      expect(Object.keys(body.availability)).toHaveLength(4)
      expect(body.availability.date).toEqual(patchObj.date)
      expect(body.availability.available).toEqual(patchObj.available)
    })
  })
  test("PATCH:400 returns error for incorrect type in body", () => {
    const patchObj = {
      date: 20240701
    };
    return request(app)
      .patch(`/api/availability/1`)
      .send(patchObj)
      .expect(400)
      .then(( {body} ) => {
        expect(body.error.date).toBe("400: Bad Request");
      });
  });
  test("PATCH:400 returns error for missing body", () => {
    const patchObj = {};
    return request(app)
      .patch(`/api/availability/1`)
      .send(patchObj)
      .expect(400)
      .then(( {body} ) => {
        expect(body.msg).toBe('400: Bad Request')
      });
  });
})


describe.only(('GET /api/customer-bookings/:user_id'), () => {
  test('200: responds with array of bookings for selected user', () => {
    return request(app)
    .get('/api/customer-bookings/1')
    .set('Authorization', `${token}`)
    .expect(200)
    .then(({body}) => {
      expect(body.bookings).toHaveLength(2)
      body.bookings.forEach((booking) => {
        expect(booking).toMatchObject({
          user_id: 1,
          entertainer_id: expect.any(Number),
          booking_date: expect.any(String),
          event_date: expect.any(String),
          event_details: expect.any(String),
          address: expect.any(String),
          status: expect.any(String)
        })
      })
    })
  })
  test("404: Not Found", () => {
    return request(app)
      .get("/api/customer-bookings/9999")
      .set('Authorization', `${token}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id not found");
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/customer-bookings/biro")
      .set('Authorization', `${token}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  }) 


  describe.only(('GET /api/entertainer-bookings/:entertainer_id'), () => {
    test('200: responds with array of bookings for selected entertainer', () => {
      return request(app)
      .get('/api/entertainer-bookings/1')
      .set('Authorization', `${token}`)
      .expect(200)
      .then(({body}) => {
        
        expect(body.bookings).toHaveLength(1)
        body.bookings.forEach((booking) => {
          expect(booking).toMatchObject({
            user_id: expect.any(Number),
            entertainer_id: 1,
            booking_date: expect.any(String),
            event_date: expect.any(String),
            event_details: expect.any(String),
            address: expect.any(String),
            status: expect.any(String)
          })
        })
      })
    })
    test("404: Not Found", () => {
      return request(app)
        .get("/api/entertainer-bookings/9999")
        .set('Authorization', `${token}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("id not found");
        });
    });
    test("400: Bad Request", () => {
      return request(app)
        .get("/api/entertainer-bookings/biro")
        .set('Authorization', `${token}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: Bad Request");
        });
    });
    }) 
  
 describe("POST /api/availability", () => {
      test("201: adds new availability", () => {
        const newAvailability = {
          entertainer_id: 2,
          date: "2024-07-01",
          available: false
        };
    
        return request(app)
          .post("/api/availability")
          .send(newAvailability)
          .expect(201)
          .then(({ body }) => {
            expect(Object.keys(body.availability)).toHaveLength(4);
            expect(body.availability.entertainer_id).toBe(newAvailability.entertainer_id);
            expect(body.availability.date).toBe(newAvailability.date);
            expect(body.availability.available).toBe(newAvailability.available);
          });
      });
      test("404: Not found when path is incorrect", () => {
        const newAvailability = {
          entertainer_id: 2,
          date: "2024-07-01",
          available: false
        };
    
        return request(app)
          .post("/api/nonsense")
          .send(newAvailability)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("404: route not found");
          });
      });
      test("400: Bad Request failing schema validation", () => {
        const newAvailability = {
          entertainer_id: 2,
          date: "2024-07-01",
          available: false
        };
      });
    });

 describe('DELETE /api/bookings/:booking_id', () => {
      test('DELETE:204 deletes the booking stated in the booking id', () => { 
          const booking_id = 2;
          return request(app)
          .delete(`/api/bookings/${booking_id}`)
          .expect(204)
      })
      test('DELETE:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const booking_id = 7868848;
          return request(app)
          .delete(`/api/bookings/${booking_id}`)
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe(`404: route not found`);
        });
        });
        test('DELETE:400 sends an appropriate status and error message when given an invalid user id', () => {
          const booking_id = "Thats all right with me ";
          return request(app)
          .delete(`/api/bookings/${booking_id}`)
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe('400: Bad Request');
            });
        });
    })

    describe("PATCH /api/bookings/:booking_id", () => {
      test("PATCH: 200 updates booking", () => {
        const patchObj = { status: "confirmed"};
        return request(app)
        .patch("/api/bookings/2")
        .send(patchObj)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.booking)).toHaveLength(8)
          expect(body.booking.status).toEqual(patchObj.status)
        })
      })
      test("PATCH:400 returns error for incorrect type in body", () => {
        const patchObj = { status: 55555};
        return request(app)
          .patch(`/api/bookings/2`)
          .send(patchObj)
          .expect(400)
          .then(( {body} ) => {
            expect(body.error.status).toBe("400: Bad Request");
          });
      });
      test("PATCH:400 returns error for missing body", () => {
        const patchObj = {};
        return request(app)
          .patch(`/api/bookings/2`)
          .send(patchObj)
          .expect(400)
          .then(( {body} ) => {
            expect(body.msg).toBe('400: Bad Request')
          });
      });
    })