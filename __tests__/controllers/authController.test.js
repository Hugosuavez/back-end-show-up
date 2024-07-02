const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../../controllers/authController');

const app = express();
app.use(express.json());

app.post('/api/auth', authController.authenticate);

// Middleware to test authenticateJWT
app.get('/api/protected', authController.authenticateJWT, (req, res) => {
    res.json({ message: 'You have access', user: req.user });
});

describe('authController Tests', () => {
    const secretKey = 'yourSecretKey'; // must match the secret key in authController

    // Mock the environment variable
    beforeAll(() => {
        process.env.JWT_SECRET = secretKey;
    });

    describe('POST /api/auth', () => {
        it('should return a token for valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth')
                .send({ username: 'user1', password: 'password1' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            const decodedToken = jwt.verify(response.body.token, secretKey);
            expect(decodedToken).toMatchObject({ id: 1, username: 'user1' });
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth')
                .send({ username: 'user1', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid username or password');
        });
    });

    describe('GET /api/protected', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app)
                .get('/api/protected');

            expect(response.status).toBe(401);
        });

        it('should return 403 if an invalid token is provided', async () => {
            const response = await request(app)
                .get('/api/protected')
                .set('Authorization', 'invalidtoken');

            expect(response.status).toBe(403);
        });

        it('should return user data if a valid token is provided', async () => {
            const token = jwt.sign({ id: 1, username: 'user1' }, secretKey, { expiresIn: '1h' });
            const response = await request(app)
                .get('/api/protected')
                .set('Authorization', token);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'You have access');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toMatchObject({ id: 1, username: 'user1' });
        });
    });
});