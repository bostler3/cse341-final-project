// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Error:', err);

  // Default error response
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (err.name === 'MongoError') {
    status = 500;
    code = 'DATABASE_ERROR';
    message = 'Database error occurred';
  }

  // Send error response
  res.status(status).json({
    code,
    message,
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
};

// Not found middleware (should be placed at the end of routes)
const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 'ROUTE_NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
