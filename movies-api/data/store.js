// In-memory data store (resets on restart). Good enough for a learning API.

const movies = [
    { id: 1, title: 'Inception',      genre: 'Sci-Fi', year: 2010, rating: 8.8, director: 'Christopher Nolan' },
    { id: 2, title: 'The Godfather',  genre: 'Crime',  year: 1972, rating: 9.2, director: 'Francis Ford Coppola' },
    { id: 3, title: 'Parasite',       genre: 'Thriller', year: 2019, rating: 8.5, director: 'Bong Joon-ho' },
    { id: 4, title: 'Spirited Away',  genre: 'Animation', year: 2001, rating: 8.6, director: 'Hayao Miyazaki' },
    { id: 5, title: 'Interstellar',   genre: 'Sci-Fi', year: 2014, rating: 8.7, director: 'Christopher Nolan' },
];

const reviews = [
    { id: 1, movieId: 1, author: 'Alice', rating: 5, comment: 'Mind-blowing.',   createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, movieId: 1, author: 'Bob',   rating: 4, comment: 'A bit confusing.', createdAt: '2026-01-02T00:00:00.000Z' },
    { id: 3, movieId: 2, author: 'Carol', rating: 5, comment: 'A masterpiece.',  createdAt: '2026-01-03T00:00:00.000Z' },
];

// simple auto-increment id generators
let movieSeq = movies.length;
let reviewSeq = reviews.length;

const nextMovieId = () => ++movieSeq;
const nextReviewId = () => ++reviewSeq;

module.exports = { movies, reviews, nextMovieId, nextReviewId };
