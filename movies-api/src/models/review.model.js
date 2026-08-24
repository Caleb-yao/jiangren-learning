// Data operations for reviews.
const { reviews, nextReviewId } = require('./store');

function findByMovieId(movieId) {
    return reviews.filter((r) => r.movieId === Number(movieId));
}

function average(list) {
    if (!list.length) return 0;
    return Number((list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(2));
}

function create(movieId, { author, rating, comment }) {
    const review = {
        id: nextReviewId(),
        movieId: Number(movieId),
        author,
        rating: Number(rating),
        comment: comment || '',
        createdAt: new Date().toISOString(),
    };
    reviews.push(review);
    return review;
}

module.exports = { findByMovieId, average, create };
