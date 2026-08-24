// Request handling for movies, backed by MongoDB via Mongoose.
const Movie = require('../models/movie.model');

// escape user input before building a RegExp
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isBadId = (err) => err.name === 'CastError';

// GET /v1/movies  -> keyword search + sort + pagination
exports.list = async (req, res, next) => {
    try {
        let { keyword = '', sort = '', page = 1, limit = 10 } = req.query;

        const filter = {};
        if (keyword.trim()) {
            const rx = new RegExp(escapeRegex(keyword.trim()), 'i');
            filter.$or = [{ title: rx }, { genre: rx }, { director: rx }];
        }

        const sortObj = {};
        if (sort) {
            const desc = sort.startsWith('-');
            const key = desc ? sort.slice(1) : sort;
            if (['rating', 'year', 'title'].includes(key)) sortObj[key] = desc ? -1 : 1;
        }

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.max(1, parseInt(limit, 10) || 10);

        const total = await Movie.countDocuments(filter);
        const data = await Movie.find(filter)
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        });
    } catch (err) {
        next(err);
    }
};

// GET /v1/movies/:id
exports.getById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        if (isBadId(err)) return res.status(404).json({ error: 'Movie not found' });
        next(err);
    }
};

// POST /v1/movies
exports.create = async (req, res, next) => {
    try {
        const { title } = req.body || {};
        if (!title) return res.status(400).json({ error: 'title is required' });
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
        next(err);
    }
};

// PUT /v1/movies/:id  (partial update)
exports.update = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body || {}, {
            new: true,
            runValidators: true,
        });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        if (isBadId(err)) return res.status(404).json({ error: 'Movie not found' });
        if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
        next(err);
    }
};

// DELETE /v1/movies/:id
exports.remove = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(204).end();
    } catch (err) {
        if (isBadId(err)) return res.status(404).json({ error: 'Movie not found' });
        next(err);
    }
};
