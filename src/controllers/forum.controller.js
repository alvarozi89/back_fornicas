const ForumService = require('../services/forum.service');


class ForumController {
    constructor() {
        this.forumService = new ForumService();
    }

    getTopics = async (req, res) => {
        try {
            // Extraemos también city_id de los query parameters
            const { page = 1, limit = 10, city_id } = req.query;
            
            // Se lo pasamos al servicio (aceptando page, limit y city_id)
            const result = await this.forumService.getTopics(
                Number(page), 
                Number(limit), 
                city_id
            );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error al obtener temas del foro:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    getTopicById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.forumService.getTopicById(id);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error al obtener el tema del foro:', error);

            const statusCode = error.message === 'Tema no encontrado' ? 404 : 500;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };

    createTopic = async (req, res) => {
        try {
            const topic = await this.forumService.createTopic(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tema creado exitosamente.',
                data: topic
            });
        } catch (error) {
            console.error('Error al crear tema del foro:', error);

            const validationErrors = [
                'El título es obligatorio',
                'El contenido es obligatorio',
                'El apodo es obligatorio',
                'La ciudad es obligatoria para crear un tema.'
            ];

            if (validationErrors.includes(error.message)) {
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

    createComment = async (req, res) => {
        try {
            const { id } = req.params; // topicId
            const comment = await this.forumService.createComment(id, req.body);

            return res.status(201).json({
                success: true,
                message: 'Comentario publicado exitosamente.',
                data: comment
            });
        } catch (error) {
            console.error('Error al crear comentario en foro:', error);

            const statusCode = error.message === 'Tema no encontrado' ? 404 : 400;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };

    reportTopic = async (req, res) => {
        try {
            const { id } = req.params; // topicId
            const report = await this.forumService.createTopicReport(id, req.body);

            return res.status(201).json({
                success: true,
                message: 'Reporte enviado correctamente.',
                data: report
            });
        } catch (error) {
            console.error('Error al reportar tema:', error);

            const statusCode = error.message === 'Tema no encontrado' ? 404 : 400;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };

    reportComment = async (req, res) => {
        try {
            const { id } = req.params; // commentId
            const report = await this.forumService.createCommentReport(id, req.body);

            return res.status(201).json({
                success: true,
                message: 'Reporte enviado correctamente.',
                data: report
            });
        } catch (error) {
            console.error('Error al reportar comentario:', error);

            const statusCode = error.message === 'Comentario no encontrado' ? 404 : 400;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };

    // Administración
    getPendingReports = async (req, res) => {
        try {
            const reports = await this.forumService.getPendingReports();

            return res.status(200).json({
                success: true,
                data: reports
            });
        } catch (error) {
            console.error('Error al obtener reportes pendientes:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    updateTopicStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const topic = await this.forumService.updateTopicStatus(id, status);

            return res.status(200).json({
                success: true,
                message: 'Estado del tema actualizado.',
                data: topic
            });
        } catch (error) {
            console.error('Error al actualizar estado del tema:', error);

            const statusCode = error.message === 'Tema no encontrado' ? 404 : 400;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };

    updateCommentStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const comment = await this.forumService.updateCommentStatus(id, status);

            return res.status(200).json({
                success: true,
                message: 'Estado del comentario actualizado.',
                data: comment
            });
        } catch (error) {
            console.error('Error al actualizar estado del comentario:', error);

            const statusCode = error.message === 'Comentario no encontrado' ? 404 : 400;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    };
}

module.exports = ForumController;