const express = require('express');
const PhotoController = require('../controllers/photo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

const photoController = new PhotoController();

router.post(
    '/',
    authMiddleware,
    (req, res, next) => {

        upload.single('photo')(req, res, (error) => {

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next();
        });
    },
    photoController.create
);
router.get('/profile/:profileId', photoController.getByProfileId);
router.delete('/:id', authMiddleware, photoController.delete);
router.put('/:id/main', authMiddleware, photoController.setMain);

module.exports = router;