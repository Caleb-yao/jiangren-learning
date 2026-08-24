const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const httpLogger = require('./middleware/httpLogger');
const rateLimiter = require('./middleware/rateLimiter');
const corsMiddleware = require('./middleware/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const moviesRouter = require('./routes/movies.routes');

const app = express();

// --- API docs (Swagger) ---
// Mounted before helmet so its CSP doesn't block swagger-ui's inline assets.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// --- global middleware ---
app.use(helmet());          // security headers
app.use(corsMiddleware);    // CORS for the frontend
app.use(express.json());    // parse JSON body
app.use(httpLogger);        // morgan -> winston (terminal + logs/app.log)
app.use(rateLimiter);       // express-rate-limit

// health check
app.get('/', (req, res) => {
    res.json({ message: 'Movies API', version: 'v1', docs: '/api-docs' });
});

// feature routes
app.use('/v1/movies', moviesRouter);

// fallbacks (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
