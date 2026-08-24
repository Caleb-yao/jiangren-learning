// Central error handler (4-arg signature is what marks it as an error handler).
module.exports = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
};
