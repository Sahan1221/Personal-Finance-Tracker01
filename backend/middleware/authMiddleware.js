// Protect routes: only allow if session has userId
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

module.exports = { requireAuth };
