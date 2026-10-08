const express = require('express');
const VideoController = require('../controllers/video.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const videoController = new VideoController();

router.post('/', authMiddleware, videoController.create);

router.get('/profile/:profileId', videoController.getByProfileId);

router.delete('/:id', authMiddleware, videoController.delete);

module.exports = router;