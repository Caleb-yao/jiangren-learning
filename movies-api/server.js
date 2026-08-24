// Entry point: connect to MongoDB first, then start the HTTP server.
const app = require('./src/app');
const connectDB = require('./src/utils/db');
const logger = require('./src/config/logger');
const { port, nodeEnv } = require('./src/config/env');

async function start() {
    try {
        await connectDB();               // 1) database first
        app.listen(port, () => {         // 2) then the server
            logger.info(`Movies API [${nodeEnv}] listening on http://localhost:${port}`);
            logger.info(`Swagger docs at http://localhost:${port}/api-docs`);
        });
    } catch (err) {
        logger.error(`Failed to start: ${err.message}`);
        process.exit(1);
    }
}

start();
