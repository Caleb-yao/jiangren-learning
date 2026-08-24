const express = require('express');
const router = express.Router();
const { movies, nextMovieId } = require('../data/store');

// GET /v1/movies  -> keyword search + rating sort + pagination
// query: keyword, sort (e.g. rating | -rating | year | title), page, limit
router.get('/', (req, res) => {
    let { keyword = '', sort = '', page = 1, limit = 10 } = req.query;

    let result = [...movies];

    // 1) keyword search: match title / genre / director (case-insensitive)
    if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        result = result.filter((m) =>
            [m.title, m.genre, m.director]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(kw))
        );
    }

    // 2) sort: leading '-' means descending, e.g. sort=-rating
    if (sort) {
        const desc = sort.startsWith('-');
        const key = desc ? sort.slice(1) : sort;
        const allowed = ['rating', 'year', 'title'];
        if (allowed.includes(key)) {
            result.sort((a, b) => {
                if (a[key] < b[key]) return desc ? 1 : -1;
                if (a[key] > b[key]) return desc ? -1 : 1;
                return 0;
            });
        }
    }

    // 3) pagination
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.max(1, parseInt(limit, 10) || 10);
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    res.json({
        data,
        pagination: { page, limit, total, totalPages },
    });
});

// GET /v1/movies/:id
router.get('/:id', (req, res) => {
    const movie = movies.find((m) => m.id === Number(req.params.id));
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
});

// POST /v1/movies
router.post('/', (req, res) => {
    const { title, genre, year, rating, director } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title is required' });

    const movie = {
        id: nextMovieId(),
        title,
        genre: genre || '',
        year: year ? Number(year) : null,
        rating: rating != null ? Number(rating) : 0,
        director: director || '',
    };
    movies.push(movie);
    res.status(201).json(movie);
});

// PUT /v1/movies/:id  (partial update allowed)
router.put('/:id', (req, res) => {
    const movie = movies.find((m) => m.id === Number(req.params.id));
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const { title, genre, year, rating, director } = req.body || {};
    if (title !== undefined) movie.title = title;
    if (genre !== undefined) movie.genre = genre;
    if (year !== undefined) movie.year = Number(year);
    if (rating !== undefined) movie.rating = Number(rating);
    if (director !== undefined) movie.director = director;

    res.json(movie);
});

// DELETE /v1/movies/:id
router.delete('/:id', (req, res) => {
    const idx = movies.findIndex((m) => m.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Movie not found' });
    movies.splice(idx, 1);
    res.status(204).end();
});

module.exports = router;
