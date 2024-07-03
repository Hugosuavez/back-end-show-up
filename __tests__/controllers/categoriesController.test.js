const request = require('supertest');
const express = require('express');
const categoriesController = require('../../controllers/categoriesControllers');
const { fetchCategories } = require('../../models/categoriesModels');

// Mock the fetchCategories function
jest.mock('../../models/categoriesModels');

const app = express();
app.use(express.json());

app.get('/api/categories', categoriesController.getCategories);

// Error handling middleware for tests
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

describe('categoriesController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return categories with status 200', async () => {
        const mockCategories = [{ id: 1, name: 'Category1' }, { id: 2, name: 'Category2' }];
        fetchCategories.mockResolvedValue(mockCategories);

        const response = await request(app).get('/api/categories');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCategories);
    });

    it('should handle errors', async () => {
        const mockError = new Error('Something went wrong');
        fetchCategories.mockRejectedValue(mockError);

        const response = await request(app).get('/api/categories');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Something went wrong');
    });
});