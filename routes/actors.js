const express = require('express');
const router = express.Router();
const validation = require('../utilities/actor-validation');
const actorsController = require('../controllers/actors');

// Route/endpoint to get all actors from database
router.get('/', actorsController.getAll);

// Route/endpoint to get a single actor from database by passing an actor ID
router.get('/:id', actorsController.getSingle);

// Route/endpoint to create a new actor
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    firstName: 'Christian',
//    lastName: 'Bale',
//    birthDate: '1974-01-30',
//    nationality: 'British',
//    awards: ['Academy Award']
//  }
//}
router.post(
  '/',
  validation.actorRules,
  validation.handleValidationErrors,
  actorsController.createActor
);

// Route/endpoint to modify an existing actor
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    firstName: 'Christian',
//    lastName: 'Bale',
//    birthDate: '1974-01-30',
//    nationality: 'British',
//    awards: ['Academy Award']
//  }
//}
router.put(
  '/:id',
  validation.actorRules,
  validation.handleValidationErrors,
  actorsController.modifyActor
);

// Route/endpoint to delete an existing actor
router.delete('/:id', actorsController.deleteActor);

module.exports = router;
