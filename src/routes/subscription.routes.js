const express = require('express');
const SubscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const router = express.Router();

const subscriptionController = new SubscriptionController();

router.get('/me', authMiddleware, subscriptionController.getMySubscriptions);

router.get('/me/active', authMiddleware, subscriptionController.getActiveSubscription);
router.put(
    '/update-statuses',
    authMiddleware,
    adminMiddleware,
    subscriptionController.updateStatuses
);

module.exports = router;