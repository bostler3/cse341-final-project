const ensureAuthenticatedApi = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    code: 'UNAUTHORIZED',
    message: 'Authentication required. Sign in at /auth/github.',
  });
};

const ensureAuthenticatedPage = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/auth/github');
};

module.exports = {
  ensureAuthenticatedApi,
  ensureAuthenticatedPage,
};
