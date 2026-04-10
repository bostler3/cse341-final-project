const express = require('express');
const router = express.Router();
const validation = require('../utilities/director-validation');
const directorsController = require('../controllers/directors');
const { ensureAuthenticatedApi } = require('../middleware/requireAuth');

// Route/endpoint to get all directors from database
router.get('/', directorsController.getAll);

// Route/endpoint to get a single director from database by passing a director ID
router.get('/:id', directorsController.getSingle);

// Route/endpoint to create a new director
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    firstName: 'Robert',
//    lastName: 'Zemeckis',
//    birthDate: '1950-05-14',
//    nationality: 'American',
//    awards: ['Academy Award Best Director']
//  }
//}
router.post(
  '/',
  ensureAuthenticatedApi,
  validation.directorRules,
  validation.handleValidationErrors,
  directorsController.createDirector
);

// Route/endpoint to modify an existing director
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    firstName: 'Robert',
//    lastName: 'Zemeckis',
//    birthDate: '1951-05-14',
//    nationality: 'American',
//    awards: ['Academy Award Best Director']
//  }
//}
router.put(
  '/:id',
  ensureAuthenticatedApi,
  validation.directorRules,
  validation.handleValidationErrors,
  directorsController.modifyDirector
);

// Route/endpoint to delete an existing director
router.delete('/:id', ensureAuthenticatedApi, directorsController.deleteDirector);

module.exports = router;
