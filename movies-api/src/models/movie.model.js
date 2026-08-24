// Mongoose Schema + Model for Movie.
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title:    { type: String, required: [true, 'title is required'], trim: true },
        genre:    { type: String, default: '' },
        year:     { type: Number, default: null },
        rating:   { type: Number, default: 0 },
        director: { type: String, default: '' },
    },
    { timestamps: true }
);

// Return clean JSON: expose `id` (string), drop `_id` and `__v`.
movieSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        return ret;
    },
});

module.exports = mongoose.model('Movie', movieSchema);
