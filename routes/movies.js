const movieController = require('../controllers/movies');
const movieValidate = require('../utilities/movie-validation');

const router = require('express').Router();

// GET /feed/posts
// localhost:8080/movies/
router.get('/', movieController.getAll);

router.get('/:id', movieController.getSingle);

// Route definition with validation middleware and error handler
router.post('/', movieValidate.movieRules, movieValidate.handleValidationErrors, movieController.createMovie);

router.put('/:id', movieController.updateMovie);

router.delete('/:id', movieController.deleteMovie);

module.exports = router;