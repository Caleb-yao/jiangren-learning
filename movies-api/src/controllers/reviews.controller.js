// Request handling for reviews (nested under a movie).
const Movie = require('../models/movie.model');
const Review = require('../models/review.model');

exports.listByMovie = (req, res) => {
    const movie = Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const list = Review.findByMovieId(movie.id);
    res.json({
        movieId: movie.id,
        count: list.length,
        averageRating: Review.average(list),
        data: list,
    });
};

exports.create = (req, res) => {
    const movie = Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const { author, rating, comment } = req.body || {};
    if (!author || rating == null) {
        return res.status(400).json({ error: 'author and rating are required' });
    }
    const numRating = Number(rating);
    if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    }

    const review = Review.create(movie.id, { author, rating: numRating, comment });
    res.status(201).json(review);
};
