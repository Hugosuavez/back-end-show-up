const request = require('supertest');
const express = require('express');
const locationsController = require('../../controllers/locationsControllers');
const { fetchLocations } = require('../../models/locationsModels');

// Mock the fetchLocations function
jest.mock('../../models/locationsModels');

const app = express();
app.use(express.json());

app.get('/api/locations', locationsController.getLocations);

// Error handling middleware for tests
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

describe('locationsController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return locations with status 200', async () => {
        const mockLocations = [{ id: 1, name: 'Location1' }, { id: 2, name: 'Location2' }];
        fetchLocations.mockResolvedValue(mockLocations);

        const response = await request(app).get('/api/locations');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockLocations);
    });

    it('should handle errors', async () => {
        const mockError = new Error('Something went wrong');
        fetchLocations.mockRejectedValue(mockError);

        const response = await request(app).get('/api/locations');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Something went wrong');
    });
});