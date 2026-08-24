// 404 fallback for unmatched routes.
module.exports = (req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
};
