const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticatedApi } = require('../middleware/requireAuth');

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/auth/success');
  }
);

// Login success route
router.get('/success', ensureAuthenticatedApi, (req, res) => {
  res.status(200).json({
    message: 'User logged in successfully',
    user: req.user,
  });
});

// Login failed route
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    code: 'LOGIN_FAILED',
    message: 'User failed to authenticate with GitHub',
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ code: 'LOGOUT_FAILED', message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
});

// Get current user profile
router.get('/user', ensureAuthenticatedApi, (req, res) => {
  res.status(200).json({
    message: 'User profile retrieved',
    user: req.user,
  });
});

module.exports = router;
