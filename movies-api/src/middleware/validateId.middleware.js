// Validate a route :param as a Mongo ObjectId BEFORE it reaches the controller.
// Invalid id -> 404 { message: 'Id not found' }, so Mongoose never throws a CastError.
const mongoose = require('mongoose');

module.exports = (paramName = 'id') => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
        return res.status(404).json({ message: 'Id not found' });
    }
    next();
};
