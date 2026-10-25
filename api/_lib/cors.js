/**
 * CORS and Preflight Helper for CHARCOAL VAULT API
 */

const ALLOWED_ORIGIN_PATTERNS = [
  'charcoal-vault.vercel.app',
  'localhost',
  '127.0.0.1',
];

function handleCors(req, res) {
  const origin = req.headers['origin'] || '';
  
  let isAllowed = false;
  if (!origin) {
    isAllowed = true;
  } else {
    isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => origin.includes(pattern));
  }

  const allowOrigin = isAllowed && origin ? origin : 'https://charcoal-vault.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie, X-Requested-With, Accept'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

module.exports = {
  handleCors,
};
