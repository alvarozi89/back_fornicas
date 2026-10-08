const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const router = express.Router();

const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user
    });
});
module.exports = router;