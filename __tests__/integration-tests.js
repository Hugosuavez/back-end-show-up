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
                    user_type: 'Entertainer',
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

    test('404: route not found', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404: route not found')
        })
    })
})

describe('GET /api/entertainers?location', () => {
    test('200: returns entertainers in correct location', () => {
        return request(app)
        .get('/api/entertainers?location=London')
        .expect(200)
        .then(({body}) => {
            expect(body.entertainers).toHaveLength(3)
            body.entertainers.forEach((entertainer) => {
                expect(entertainer).toMatchObject({
                    username: expect.any(String),
                    password: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    profile_img_url: expect.any(String),
                    user_type: 'Entertainer',
                    category: expect.any(String),
                    location: 'London',
                    entertainer_name: expect.any(String),
                    description: expect.any(String),
                    price: expect.any(Number),
                    url: expect.any(String),
                    media_id: expect.any(Number)
                })
            })
        })
    })
    test('404: invalid location', () => {
        return request(app)
        .get('/api/entertainers?location=lanchesterpool')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
})

describe('GET /api/entertainers?category', () => {
    test('200: returns entertainers in correct category', () => {
        return request(app)
        .get('/api/entertainers?category=Juggler')
        .expect(200)
        .then(({body}) => {
            expect(body.entertainers).toHaveLength(2)
            body.entertainers.forEach((entertainer) => {
                expect(entertainer).toMatchObject({
                    username: expect.any(String),
                    password: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    profile_img_url: expect.any(String),
                    user_type: 'Entertainer',
                    category: 'Juggler',
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
    test('404: invalid category', () => {
        return request(app)
        .get('/api/entertainers?category=weapon')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
})

describe('GET /api/entertainers?date', () => {
    test('200: returns entertainers available on that date', () => {
        return request(app)
        .get('/api/entertainers?date=2024-07-01')
        .expect(200)
        .then(({body}) => {
            expect(body.entertainers).toHaveLength(3)
            body.entertainers.forEach((entertainer) => {
                expect(entertainer).toMatchObject({
                    username: expect.any(String),
                    password: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    profile_img_url: expect.any(String),
                    user_type: 'Entertainer',
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
    test('404: invalid date', () => {
        return request(app)
        .get('/api/entertainers?date=chips')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
})

describe('GET /api/entertainers/:user_id', () => {
    test('200: responds with correct entertainer object', () => {
        return request(app)
        .get('/api/entertainers/2')
        .expect(200)
        .then(({body}) => {
            expect(body.entertainer).toMatchObject({
                user_id: 2,
                username: expect.any(String),
                password: expect.any(String),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                profile_img_url: expect.any(String),
                user_type: 'Entertainer',
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
    test('404: Not Found', () => {
        return request(app)
        .get('/api/entertainers/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request', () => {
        return request(app)
        .get('/api/entertainers/biro')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})

describe('GET /locations', () => {
    test('200: returns an array of location objects', () => {
        return request(app)
        .get('/api/locations')
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(2)
            body.forEach((location) => {
                expect(location).toMatchObject({
                    location: expect.any(String)
                })
            })
        })
    })
})

describe('GET /categories', () => {
    test('200: returns an array of category objects', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            console.log(body)
            expect(body).toHaveLength(2)
            body.forEach((category) => {
                expect(category).toMatchObject({
                    category: expect.any(String)
                })
            })
        })
    })
})