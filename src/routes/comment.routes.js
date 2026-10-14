const express = require('express');
const CommentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

const commentController = new CommentController();

router.post(
    '/:profileId',
    commentController.create
);

router.get(
    '/:profileId',
    commentController.getApprovedByProfile
);

router.put(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    commentController.updateStatus
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    commentController.delete
);


router.put(
    '/:id/moderation',
    authMiddleware,
    commentController.moderateReview
);

router.get(
    '/:profileId/pending',
    authMiddleware,
    commentController.getPendingByProfile
);

module.exports = router;