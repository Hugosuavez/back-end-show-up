// __tests__/controllers/uploadFile.test.js

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app'); // Adjust the path as necessary
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { mockClient } = require('aws-sdk-client-mock');

// Mock the S3 client
const s3Mock = mockClient(S3Client);

// Mock user data and JWT secret
const mockUser = { id: 1, username: 'testuser' };
const secretKey = 'yourSecretKey'; // Ensure this matches your secret key in authController

// Generate a mock JWT for testing
const generateMockJWT = () => {
  return jwt.sign(mockUser, secretKey, { expiresIn: '1h' });
};

describe('uploadController Tests', () => {
  beforeAll(() => {
    // Mock the PutObjectCommand to always return the mocked URL
    s3Mock.on(PutObjectCommand).resolves({
      Location: 'https://mocked-url.com/mock-image.png',
    });
  });

  afterAll(() => {
    s3Mock.reset();
  });

  it('should return 400 if no file is uploaded', async () => {
    const token = generateMockJWT();
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', token);
    
    expect(response.status).toBe(400);
    expect(response.text).toBe('No files were uploaded.');
  });

  it('should upload an image and return the URL', async () => {
    const token = generateMockJWT();
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', token)
      .attach('file', Buffer.from('fake-image-content'), 'test-image.png');

    const expectedLocation = `https://show-up-northcoders.s3.amazonaws.com/${response.body.location.split('/').pop()}`;
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully.');
    expect(response.body).toHaveProperty('location', expectedLocation);
  });
});