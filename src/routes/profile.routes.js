const express = require('express');
const ProfileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const profileController = new ProfileController();

router.get('/', profileController.getAllActive);
router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, profileController.updateMyProfile);
// 🚀 NUEVA RUTA PARA CAMBIAR LA CONTRASEÑA
router.put('/update-password', authMiddleware, profileController.updatePassword);
router.get('/:id', profileController.getById);

router.put('/deactivate', authMiddleware, profileController.deactivateAccount);

// Ruta para reactivar la cuenta
router.put('/reactivate', authMiddleware, profileController.reactivateAccount);

module.exports = router;


