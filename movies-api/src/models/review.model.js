// Mongoose Schema + Model for Review (belongs to a Movie).
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
        author:  { type: String, required: [true, 'author is required'] },
        rating:  { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

reviewSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        return ret;
    },
});

module.exports = mongoose.model('Review', reviewSchema);
