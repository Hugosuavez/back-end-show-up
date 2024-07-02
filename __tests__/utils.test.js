const { validateToken, validateFileType, executeQuery } = require("../utils");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Mock database
const mockDb = new Pool();
mockDb.query = jest.fn();

// Test secret key for JWT
const secretKey = "testSecretKey";

// Test data
const validToken = jwt.sign({ id: 1, username: "testuser" }, secretKey, {
  expiresIn: "1h",
});
const invalidToken = "invalidToken";
const expiredToken = jwt.sign({ id: 1, username: "testuser" }, secretKey, {
  expiresIn: "-1h",
});

describe("Utils Tests", () => {
  describe("validateToken", () => {
    it("should validate a valid token", () => {
      const result = validateToken(validToken, secretKey);
      expect(result.valid).toBe(true);
      expect(result).toHaveProperty("decoded");
    });

    it("should invalidate an invalid token", () => {
      const result = validateToken(invalidToken, secretKey);
      expect(result.valid).toBe(false);
      expect(result).toHaveProperty("error");
    });

    it("should invalidate an expired token", () => {
      const result = validateToken(expiredToken, secretKey);
      expect(result.valid).toBe(false);
      expect(result).toHaveProperty("error");
    });
  });

  describe("validateFileType", () => {
    const allowedTypes = ["image/png", "image/jpeg"];

    it("should validate a file with an allowed type", () => {
      const file = { mimetype: "image/png" };
      const result = validateFileType(file, allowedTypes);
      expect(result).toBe(true);
    });

    it("should invalidate a file with a disallowed type", () => {
      const file = { mimetype: "application/pdf" };
      const result = validateFileType(file, allowedTypes);
      expect(result).toBe(false);
    });
  });

  describe("executeQuery", () => {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [1];
    const mockResult = { rows: [{ id: 1, username: "testuser" }] };

    it("should execute a valid query", async () => {
      mockDb.query.mockResolvedValueOnce(mockResult);
      const result = await executeQuery(mockDb, query, values);
      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockResult.rows);
    });

    it("should handle a query error", async () => {
      const mockError = new Error("Query failed");
      mockDb.query.mockRejectedValueOnce(mockError);
      const result = await executeQuery(mockDb, query, values);
      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });
});
