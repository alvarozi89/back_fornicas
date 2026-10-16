const { Router } = require('express');
const ForumController = require('../controllers/forum.controller');

const router = Router();
const forumController = new ForumController();

// Rutas de temas
router.get('/topics', forumController.getTopics);
router.post('/topics', forumController.createTopic);
router.get('/topics/:id', forumController.getTopicById);

// Rutas de comentarios
router.post('/topics/:id/comments', forumController.createComment);

// Rutas de reportes (¡Asegúrate de tener estas!)
router.post('/topics/:id/report', forumController.reportTopic);
router.post('/comments/:id/report', forumController.reportComment);

// Rutas de administración
router.get('/admin/reports', forumController.getPendingReports);
router.patch('/admin/topics/:id/status', forumController.updateTopicStatus);
router.patch('/admin/comments/:id/status', forumController.updateCommentStatus);

module.exports = router;