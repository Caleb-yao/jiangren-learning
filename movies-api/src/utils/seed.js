// One-off seed script: `npm run seed`. Inserts sample movies + reviews if empty.
const mongoose = require('mongoose');
const connectDB = require('./db');
const Movie = require('../models/movie.model');
const Review = require('../models/review.model');
const logger = require('../config/logger');

const sampleMovies = [
    { title: 'Inception',     genre: 'Sci-Fi',    year: 2010, rating: 8.8, director: 'Christopher Nolan' },
    { title: 'The Godfather', genre: 'Crime',     year: 1972, rating: 9.2, director: 'Francis Ford Coppola' },
    { title: 'Parasite',      genre: 'Thriller',  year: 2019, rating: 8.5, director: 'Bong Joon-ho' },
    { title: 'Spirited Away', genre: 'Animation', year: 2001, rating: 8.6, director: 'Hayao Miyazaki' },
    { title: 'Interstellar',  genre: 'Sci-Fi',    year: 2014, rating: 8.7, director: 'Christopher Nolan' },
];

async function seed() {
    await connectDB();
    await Movie.deleteMany({});
    await Review.deleteMany({});
    const movies = await Movie.insertMany(sampleMovies);
    await Review.insertMany([
        { movieId: movies[0]._id, author: 'Alice', rating: 5, comment: 'Mind-blowing.' },
        { movieId: movies[0]._id, author: 'Bob',   rating: 4, comment: 'A bit confusing.' },
        { movieId: movies[1]._id, author: 'Carol', rating: 5, comment: 'A masterpiece.' },
    ]);
    logger.info(`Seeded ${movies.length} movies + 3 reviews`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    logger.error(`Seed failed: ${err.message}`);
    process.exit(1);
});
