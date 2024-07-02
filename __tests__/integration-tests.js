const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')

afterAll(() => {
    return db.end();
})

beforeEach(() => {
    return seed(data)
})

describe('GET /api/entertainers', () => {
    test('200: responds with an array objects with correct properties', () => {
        return request(app)
        .get('/api/entertainers')
        .expect(200)
        .then(({body}) => {
            expect(body.entertainers).toHaveLength(4)
            body.entertainers.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    password: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    profile_img_url: expect.any(String),
                    user_type: expect.any(String),
                    category: expect.any(String),
                    location: expect.any(String),
                    entertainer_name: expect.any(String),
                    description: expect.any(String),
                    price: expect.any(Number),
                    url: expect.any(String),
                    media_id: expect.any(Number)
                })
            })
        })
    })
})