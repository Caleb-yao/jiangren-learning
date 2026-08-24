const app = require('./src/app');
const logger = require('./src/config/logger');
const { port, nodeEnv } = require('./src/config/env');

app.listen(port, () => {
    logger.info(`Movies API [${nodeEnv}] listening on http://localhost:${port}`);
    logger.info(`Swagger docs at http://localhost:${port}/api-docs`);
});
