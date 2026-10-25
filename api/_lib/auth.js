const jwt = require('jsonwebtoken');
const { getAuthToken } = require('./cookies');

const JWT_SECRET = process.env.JWT_SECRET || 'charcoal-vault-dev-secret-do-not-use-in-production-256';

/**
 * Validates authentication session token from cookies or Authorization header.
 * Returns decoded token { userId, email, role } or throws 401 error.
 */
async function requireAuth(req) {
  const token = getAuthToken(req);

  if (!token) {
    const error = new Error('Authentication required: No session token found.');
    error.status = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) {
      const error = new Error('Invalid session payload.');
      error.status = 401;
      throw error;
    }
    return decoded;
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid session token.'
    );
    error.status = 401;
    throw error;
  }
}

module.exports = {
  requireAuth,
  JWT_SECRET,
};
