// Central error handler (4-arg signature marks it as an error handler).
const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
    logger.error(err.stack || err.message || String(err));
    res.status(500).json({ error: 'Internal Server Error' });
};
