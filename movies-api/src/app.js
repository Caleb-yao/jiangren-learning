const express = require('express');

const corsMiddleware = require('./middleware/cors');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const moviesRouter = require('./routes/movies.routes');

const app = express();

// global middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(logger);

// health check
app.get('/', (req, res) => {
    res.json({ message: 'Movies API', version: 'v1' });
});

// feature routes
app.use('/v1/movies', moviesRouter);

// fallbacks (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
