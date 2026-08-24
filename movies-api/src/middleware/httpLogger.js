// HTTP request logging: morgan formats the line, winston writes it to the terminal + file.
const morgan = require('morgan');
const logger = require('../config/logger');
const { nodeEnv } = require('../config/env');

const stream = { write: (message) => logger.info(message.trim()) };
const format = nodeEnv === 'production' ? 'combined' : 'dev';

module.exports = morgan(format, { stream });
