const express = require('express');
const router = express.Router();
const controller = require('../controllers/movies.controller');
const reviewsRouter = require('./reviews.routes');

// nested resource: /v1/movies/:id/reviews
router.use('/:id/reviews', reviewsRouter);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
