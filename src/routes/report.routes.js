const express = require('express');
const ReportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

const reportController = new ReportController();

/*
 * Público
 * Reportar un perfil o comentario
 */
router.post(
    '/:profileId',
    reportController.create
);

/*
 * ADMIN
 * Obtener todos los reportes
 */
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    reportController.getAll
);

/*
 * ADMIN
 * Obtener reportes por estado
 */
router.get(
    '/status/:status',
    authMiddleware,
    adminMiddleware,
    reportController.getByStatus
);

/*
 * ADMIN
 * Actualizar estado
 */
router.put(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    reportController.updateStatus
);

/*
 * ADMIN
 * Eliminar reporte
 */
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    reportController.delete
);

module.exports = router;