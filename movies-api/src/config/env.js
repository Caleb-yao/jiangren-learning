// Load environment variables from .env, then expose a typed config with defaults.
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moviesdb',
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.RATE_LIMIT_MAX) || 100,
    },
};
