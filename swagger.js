const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'Team 09 CSE341 Movies API'
  },
  host: 'localhost:8080'
};

const outputFile = './swagger.json';
// const routes = ['./path/userRoutes.js', './path/bookRoutes.js'];
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);