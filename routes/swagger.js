const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Get the host for Swagger based on the environment
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? process.env.RENDER_URL : `localhost:${port}`;

// Set swagger document's host and schemes properties
swaggerDocument.host = host;
swaggerDocument.schemes = isProduction ? ['https'] : ['http']; // Use https in production

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;