const movieController = require('../controllers/movies');
const movieValidate = require('../utilities/movie-validation');
const { ensureAuthenticatedApi } = require('../middleware/requireAuth');

const router = require('express').Router();

// GET /feed/posts
// localhost:8080/movies/
router.get('/', movieController.getAll);

router.get('/:id', movieController.getSingle);

// Route definition with validation middleware and error handler
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    title: 'The Dark Knight Rises',
//    releaseYear: 2012,
//    genre: ['Action'],
//    rating: 'PG-13',
//    runtimeMinutes: 165,
//    directorId: '67f0c3e0a1b2c3d4e5f60789',
//    actorIds: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
//    synopsis: 'Bane attacks Gotham, forcing Bruce Wayne to become Batman again.'
//  }
//}
router.post(
  '/',
  ensureAuthenticatedApi,
  movieValidate.movieRules,
  movieValidate.handleValidationErrors,
  movieController.createMovie
);

//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    title: 'The Dark Knight Rises',
//    releaseYear: 2012,
//    genre: ['Action', 'Crime'],
//    rating: 'PG-13',
//    runtimeMinutes: 165,
//    directorId: '67f0c3e0a1b2c3d4e5f60789',
//    actorIds: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
//    synopsis: 'Bane attacks Gotham, forcing Bruce Wayne to become Batman again.'
//  }
//}
router.put(
  '/:id',
  ensureAuthenticatedApi,
  movieValidate.movieRules,
  movieValidate.handleValidationErrors,
  movieController.updateMovie
);

router.delete('/:id', ensureAuthenticatedApi, movieController.deleteMovie);

module.exports = router;
