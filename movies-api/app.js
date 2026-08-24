const express = require('express');
const cors = require('cors');

const moviesRouter = require('./routes/movies');
const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // allow the frontend page to call this API
app.use(express.json());    // parse JSON body -> req.body

// request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// health check
app.get('/', (req, res) => {
    res.json({ message: 'Movies API', version: 'v1' });
});

// nested reviews mounted first so /v1/movies/:id/reviews resolves cleanly
app.use('/v1/movies/:id/reviews', reviewsRouter);
app.use('/v1/movies', moviesRouter);

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// central error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Movies API listening on http://localhost:${PORT}`);
});

module.exports = app;
