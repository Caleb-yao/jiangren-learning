// Basic rate limiting to protect the API from abuse.
const rateLimit = require('express-rate-limit');
const { rateLimit: cfg } = require('../config/env');

module.exports = rateLimit({
    windowMs: cfg.windowMs,
    max: cfg.max,
    standardHeaders: true,   // adds RateLimit-* headers
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
