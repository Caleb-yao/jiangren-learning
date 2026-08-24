// Application logger (winston). Console output for the terminal + a file transport.
const winston = require('winston');
const { nodeEnv, logLevel } = require('./env');

const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
);

const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: logLevel,
    format: nodeEnv === 'production' ? prodFormat : devFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

module.exports = logger;
