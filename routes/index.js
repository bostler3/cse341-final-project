const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Movie API is running',
  });
});

router.use('/actors', require('./actors'));

module.exports = router;
