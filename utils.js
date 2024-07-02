const jwt = require('jsonwebtoken');

const validateToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

const validateFileType = (file, allowedTypes) => {
  const fileType = file.mimetype;
  return allowedTypes.includes(fileType);
};

const executeQuery = async (db, query, values) => {
  try {
    const result = await db.query(query, values);
    return { success: true, result: result.rows };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports = { validateToken, validateFileType, executeQuery };