// Data operations for movies. No req/res here — pure data access.
const { movies, nextMovieId } = require('./store');

// list with keyword search + sort + pagination
function query({ keyword = '', sort = '', page = 1, limit = 10 }) {
    let result = [...movies];

    if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        result = result.filter((m) =>
            [m.title, m.genre, m.director]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(kw))
        );
    }

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

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.max(1, parseInt(limit, 10) || 10);
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return { data, pagination: { page, limit, total, totalPages } };
}

function findById(id) {
    return movies.find((m) => m.id === Number(id));
}

function create({ title, genre, year, rating, director }) {
    const movie = {
        id: nextMovieId(),
        title,
        genre: genre || '',
        year: year ? Number(year) : null,
        rating: rating != null ? Number(rating) : 0,
        director: director || '',
    };
    movies.push(movie);
    return movie;
}

function update(id, { title, genre, year, rating, director }) {
    const movie = findById(id);
    if (!movie) return null;
    if (title !== undefined) movie.title = title;
    if (genre !== undefined) movie.genre = genre;
    if (year !== undefined) movie.year = Number(year);
    if (rating !== undefined) movie.rating = Number(rating);
    if (director !== undefined) movie.director = director;
    return movie;
}

function remove(id) {
    const idx = movies.findIndex((m) => m.id === Number(id));
    if (idx === -1) return false;
    movies.splice(idx, 1);
    return true;
}

module.exports = { query, findById, create, update, remove };
