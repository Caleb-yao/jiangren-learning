const express = require('express');
// mergeParams so we can read :id from the parent /movies/:id path
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/reviews.controller');

router.get('/', controller.listByMovie);
router.post('/', controller.create);

module.exports = router;
