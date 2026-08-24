const express = require('express');
// mergeParams lets this router read :id from the parent /movies/:id path
const router = express.Router({ mergeParams: true });
const { movies, reviews, nextReviewId } = require('../data/store');

const findMovie = (id) => movies.find((m) => m.id === Number(id));

// GET /v1/movies/:id/reviews
router.get('/', (req, res) => {
    const movie = findMovie(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const list = reviews.filter((r) => r.movieId === movie.id);
    const averageRating = list.length
        ? Number((list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(2))
        : 0;

    res.json({ movieId: movie.id, count: list.length, averageRating, data: list });
});

// POST /v1/movies/:id/reviews
router.post('/', (req, res) => {
    const movie = findMovie(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const { author, rating, comment } = req.body || {};
    if (!author || rating == null) {
        return res.status(400).json({ error: 'author and rating are required' });
    }
    const numRating = Number(rating);
    if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    }

    const review = {
        id: nextReviewId(),
        movieId: movie.id,
        author,
        rating: numRating,
        comment: comment || '',
        createdAt: new Date().toISOString(),
    };
    reviews.push(review);
    res.status(201).json(review);
});

module.exports = router;
