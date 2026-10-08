const express = require('express');
const ProfileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const profileController = new ProfileController();

router.get('/', profileController.getAllActive);
router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, profileController.updateMyProfile);
router.get('/:id', profileController.getById);





module.exports = router;


