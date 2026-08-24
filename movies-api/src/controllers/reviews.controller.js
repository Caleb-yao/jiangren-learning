// Request handling for reviews (nested under a movie), backed by MongoDB via Mongoose.
const Movie = require('../models/movie.model');
const Review = require('../models/review.model');

const isBadId = (err) => err.name === 'CastError';

// GET /v1/movies/:id/reviews
exports.listByMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        const list = await Review.find({ movieId: movie._id }).sort({ createdAt: 1 });
        const averageRating = list.length
            ? Number((list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(2))
            : 0;

        res.json({ movieId: movie.id, count: list.length, averageRating, data: list });
    } catch (err) {
        if (isBadId(err)) return res.status(404).json({ error: 'Movie not found' });
        next(err);
    }
};

// POST /v1/movies/:id/reviews
exports.create = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        const { author, rating, comment } = req.body || {};
        if (!author || rating == null) {
            return res.status(400).json({ error: 'author and rating are required' });
        }
        const numRating = Number(rating);
        if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
        }

        const review = await Review.create({
            movieId: movie._id,
            author,
            rating: numRating,
            comment,
        });
        res.status(201).json(review);
    } catch (err) {
        if (isBadId(err)) return res.status(404).json({ error: 'Movie not found' });
        if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
        next(err);
    }
};
