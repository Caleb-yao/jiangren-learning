const express = require('express');
const router = express.Router();
const controller = require('../controllers/movies.controller');
const validateId = require('../middleware/validateId.middleware');
const reviewsRouter = require('./reviews.routes');

// validate :id up front for every route that has one (invalid -> 404 before controller)
router.use('/:id/reviews', validateId('id'), reviewsRouter);

router.get('/', controller.list);
router.post('/', controller.create);

router.get('/:id', validateId('id'), controller.getById);
router.put('/:id', validateId('id'), controller.update);
router.delete('/:id', validateId('id'), controller.remove);

module.exports = router;
