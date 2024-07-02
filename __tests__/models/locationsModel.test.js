const db = require('../../db/connection');
const { fetchLocations, checkLocationIsValid } = require('../../models/locationsModels');

// Mock the db.query function
jest.mock('../../db/connection');

describe('locationsModels Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchLocations', () => {
        it('should return locations', async () => {
            const mockLocations = [{ id: 1, name: 'Location1' }, { id: 2, name: 'Location2' }];
            db.query.mockResolvedValue({ rows: mockLocations });

            const locations = await fetchLocations();
            expect(locations).toEqual(mockLocations);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM locations');
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            db.query.mockRejectedValue(mockError);

            await expect(fetchLocations()).rejects.toThrow('Database error');
        });
    });

    describe('checkLocationIsValid', () => {
        it('should return if location is valid', async () => {
            const mockLocation = [{ id: 1, location: 'Location1' }];
            db.query.mockResolvedValue({ rows: mockLocation });

            await expect(checkLocationIsValid('Location1')).resolves.not.toThrow();
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM locations where location = $1', ['Location1']);
        });

        it('should throw 404 error if location is not found', async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(checkLocationIsValid('InvalidLocation')).rejects.toEqual({ status: 404, msg: '404: Not Found' });
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM locations where location = $1', ['InvalidLocation']);
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            db.query.mockRejectedValue(mockError);

            await expect(checkLocationIsValid('Location1')).rejects.toThrow('Database error');
        });
    });
});