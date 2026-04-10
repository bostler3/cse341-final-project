const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./middleware/auth');
const mongodb = require('./data/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const swaggerRoutes = require('./routes/swagger');
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Render terminates TLS at the proxy; trust it so secure cookies work.
  app.set('trust proxy', 1);
}

// Body parser middleware
app.use(bodyParser.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      secure: isProduction,
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));

// Mount the swagger routes
app.use('/api-docs', swaggerRoutes);

// Error handling middleware (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`database is listening and node running on port ${port}`);
    });
  }
});
