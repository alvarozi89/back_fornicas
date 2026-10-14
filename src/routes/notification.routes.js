
const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', authMiddleware, notificationController.getMyNotifications);

router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

router.put('/read-all', authMiddleware, notificationController.markAllAsRead);

router.put('/:id/read', authMiddleware, notificationController.markAsRead);

module.exports = router;