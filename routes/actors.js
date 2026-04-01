const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actors');

router.get('/', actorsController.getAllActors);
router.get('/:id', actorsController.getActorById);

module.exports = router;
