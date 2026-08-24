const express = require('express');

const app = express();
const PORT = 3000;

// parse JSON body -> req.body
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// 1. first route: return JSON
app.get('/', (req, res) => {
    res.json({
        message: 'Hello Express',
        port: PORT,
        time: new Date().toISOString()
    });
});

// 2. req.params -> GET /users/1
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
        return res.status(400).json({ error: 'id must be a number' });
    }

    res.json({
        source: 'req.params',
        params: req.params,
        user: { id: Number(id), name: `user-${id}` }
    });
});

// nested params -> GET /users/1/posts/9
app.get('/users/:userId/posts/:postId', (req, res) => {
    res.json({
        source: 'req.params',
        params: req.params
    });
});

// 3. req.query -> GET /search?keyword=express&page=2&size=5
app.get('/search', (req, res) => {
    const { keyword = '', page = 1, size = 10 } = req.query;

    res.json({
        source: 'req.query',
        query: req.query,
        keyword,
        page: Number(page),
        size: Number(size),
        results: keyword ? [`${keyword}-1`, `${keyword}-2`] : []
    });
});

// 4. req.body -> POST /users
app.post('/users', (req, res) => {
    const { name, email } = req.body || {};

    if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
    }

    res.status(201).json({
        source: 'req.body',
        body: req.body,
        created: { id: Date.now(), name, email }
    });
});

// 5. params + query + body together -> PUT /users/1?notify=true
app.put('/users/:id', (req, res) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body
    });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
