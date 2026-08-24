// Database connection helper: wraps mongoose.connect() with logging.
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { mongoUri } = require('../config/env');

mongoose.connection.on('connected', () => logger.info(`MongoDB connected: ${mongoose.connection.name}`));
mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

async function connectDB() {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    return mongoose.connection;
}

module.exports = connectDB;
