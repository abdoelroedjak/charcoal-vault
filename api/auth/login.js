const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSupabase } = require('../_lib/supabase');
const { handleCors } = require('../_lib/cors');
const { setAuthCookie } = require('../_lib/cookies');
const { checkRateLimit, getClientIp } = require('../_lib/rateLimit');
const { loginBody, validate } = require('../_lib/validate');
const { log: auditLog } = require('../_lib/audit');
const { JWT_SECRET } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp, 5, 10 * 60 * 1000); // 5 attempts per 10 minutes

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
    return res.status(500).json({ error: 'Database connection configuration error' });
  }

  try {
    // Brute force check in database login_attempts table over last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: failedAttempts } = await supabase
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip', clientIp)
      .eq('success', false)
      .gte('created_at', tenMinutesAgo);

    if (failedAttempts && failedAttempts >= 5) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Too many failed login attempts recorded. Please wait 10 minutes.',
      });
    }

    // Lookup user
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role, is_active')
      .eq('email', email)
      .maybeSingle();

    if (userError || !user || !user.is_active) {
      // Record failure attempt
      await supabase.from('login_attempts').insert({
        ip: clientIp,
        email: email,
        success: false,
      });

      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await supabase.from('login_attempts').insert({
        ip: clientIp,
        email: email,
        success: false,
      });

      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Invalid email or password.',
      });
    }

    // Record successful login attempt
    await supabase.from('login_attempts').insert({
      ip: clientIp,
      email: email,
      success: true,
    });

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

    // Set HttpOnly cookie
    setAuthCookie(res, token);

    // Audit log
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
    });
  }
};
