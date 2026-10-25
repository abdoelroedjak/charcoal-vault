import jwt from 'jsonwebtoken';
import { getAuthToken } from './cookies.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'charcoal-vault-dev-secret-do-not-use-in-production-256';

export async function requireAuth(req) {
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
