// Request handling for movies: read req -> call model -> send res.
const Movie = require('../models/movie.model');

exports.list = (req, res) => {
    res.json(Movie.query(req.query));
};

exports.getById = (req, res) => {
    const movie = Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
};

exports.create = (req, res) => {
    const { title } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title is required' });
    const movie = Movie.create(req.body);
    res.status(201).json(movie);
};

exports.update = (req, res) => {
    const movie = Movie.update(req.params.id, req.body || {});
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
};

exports.remove = (req, res) => {
    const ok = Movie.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Movie not found' });
    res.status(204).end();
};
