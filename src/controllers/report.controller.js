const ReportService = require('../services/report.service');
const { generateVisitorToken } = require('../utils/visitor-token');

class ReportController {

    constructor() {
        this.reportService = new ReportService();
    }

    create = async (req, res) => {
        try {
            const { profileId } = req.params;

            const {
                commentId,
                reason,
                description
            } = req.body;

            let visitorToken =
                req.headers['x-visitor-token'];

            if (!visitorToken) {
                visitorToken =
                    generateVisitorToken();
            }

            const result =
                await this.reportService.createReport(
                    profileId,
                    commentId,
                    visitorToken,
                    reason,
                    description
                );

            res.setHeader(
                'x-visitor-token',
                visitorToken
            );

            return res.status(201).json({
                success: true,
                message: 'Reporte enviado correctamente',
                data: result
            });

        } catch (error) {

            console.error(
                'Error al crear reporte:',
                error
            );

            const validationErrors = [
                'El visitor token es obligatorio',
                'El motivo del reporte es obligatorio',
                'El motivo del reporte no puede superar los 150 caracteres',
                'La descripción no puede superar los 1000 caracteres',
                'Ya has reportado este comentario'
            ];

            if (
                validationErrors.includes(
                    error.message
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    getAll = async (req, res) => {
        try {

            const reports =
                await this.reportService.getAllReports();

            return res.status(200).json({
                success: true,
                data: reports
            });

        } catch (error) {

            console.error(
                'Error al obtener reportes:',
                error
            );

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    getByStatus = async (req, res) => {
        try {

            const { status } = req.params;

            const reports =
                await this.reportService.getReportsByStatus(
                    status
                );

            return res.status(200).json({
                success: true,
                data: reports
            });

        } catch (error) {

            console.error(
                'Error al obtener reportes:',
                error
            );

            if (
                error.message ===
                'Estado de reporte no válido'
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    updateStatus = async (req, res) => {
        try {

            const { id } = req.params;
            const { status } = req.body;

            const result =
                await this.reportService.updateStatus(
                    id,
                    status
                );

            return res.status(200).json({
                success: true,
                message: 'Estado del reporte actualizado correctamente',
                data: result
            });

        } catch (error) {

            console.error(
                'Error al actualizar reporte:',
                error
            );

            if (
                error.message ===
                'Estado de reporte no válido' ||
                error.message ===
                'Reporte no encontrado'
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    delete = async (req, res) => {
        try {

            const { id } = req.params;

            const result =
                await this.reportService.deleteReport(
                    id
                );

            return res.status(200).json({
                success: true,
                message: 'Reporte eliminado correctamente',
                data: result
            });

        } catch (error) {

            console.error(
                'Error al eliminar reporte:',
                error
            );

            if (
                error.message ===
                'Reporte no encontrado'
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
}

module.exports = ReportController;