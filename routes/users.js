const express = require('express');
const router = express.Router();
const validation = require('../utilities/user-validation');
const usersController = require('../controllers/users');
const { ensureAuthenticatedApi } = require('../middleware/requireAuth');

// Route/endpoint to get all users from database
router.get('/', usersController.getAll);

// Route/endpoint to get a single user from database by passing a user ID
router.get('/:id', usersController.getSingle);

// Route/endpoint to create a new user
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    displayName: 'John Doe',
//    email: 'john.doe@example.com',
//    role: 'editor'
//  }
//}
router.post(
  '/',
  ensureAuthenticatedApi,
  validation.userRules,
  validation.handleValidationErrors,
  usersController.createUser
);

// Route/endpoint to modify an existing user
//#swagger.parameters['body'] = {
//  in: 'body',
//  required: true,
//  schema: {
//    displayName: 'John.Smith',
//    role: 'editor',
//    email: 'john.smith@example.com',
//    githubId: '12345'
//  }
//}
router.put(
  '/:id',
  ensureAuthenticatedApi,
  validation.userRules,
  validation.handleValidationErrors,
  usersController.modifyUser
);

// Route/endpoint to delete an existing user
router.delete('/:id', ensureAuthenticatedApi, usersController.deleteUser);

module.exports = router;
