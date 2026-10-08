const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const router = express.Router();

const paymentController = new PaymentController();

router.get('/me', authMiddleware, paymentController.getMyPayments);
router.post(
    '/manual',
    authMiddleware,
    paymentController.createManualPayment
);
router.get(
    '/pending',
    authMiddleware,
    adminMiddleware,
    paymentController.getPendingPayments
);
router.put(
    '/:id/approve',
    authMiddleware,
    adminMiddleware,
    paymentController.approvePayment
);
router.put(
    '/:id/reject',
    authMiddleware,
    adminMiddleware,
    paymentController.rejectPayment
);
module.exports = router;