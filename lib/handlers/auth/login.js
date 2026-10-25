import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabase } from '../../supabase.js';
import { handleCors } from '../../cors.js';
import { setAuthCookie } from '../../cookies.js';
import { checkRateLimit, getClientIp } from '../../rateLimit.js';
import { loginBody, validate } from '../../validate.js';
import { log as auditLog } from '../../audit.js';
import { JWT_SECRET } from '../../auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp, 10, 10 * 60 * 1000);

  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Too many login attempts. Please wait 10 minutes before trying again.',
    });
  }

  let body;
  try {
    body = validate(loginBody, req.body || {});
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message, details: err.errors });
  }

  const email = body.email.toLowerCase().trim();
  const password = body.password;

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.error('Database connection configuration error:', err);
    return res.status(500).json({ error: 'Database connection configuration error', details: err.message });
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role, is_active')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.error('Supabase query error looking up admin user:', userError);
      return res.status(500).json({ error: 'Database error while checking credentials', details: userError.message });
    }

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token (2 hours expiry)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    setAuthCookie(res, token);

    await auditLog(supabase, user.id, 'LOGIN', 'auth', user.id, {
      ip: clientIp,
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    return res.status(200).json({
      message: 'ok',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Unhandled login error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected authentication error occurred.',
      details: err.message,
    });
  }
}
