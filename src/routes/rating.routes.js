const express = require('express');
const RatingController = require('../controllers/rating.controller');

const router = express.Router();

const ratingController = new RatingController();

router.post(
    '/:profileId',
    ratingController.create
);

router.get(
    '/:profileId',
    ratingController.getProfileRating
);

module.exports = router;