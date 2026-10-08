const CommentService = require('../services/comment.service');
const { generateVisitorToken } = require('../utils/visitor-token');

class CommentController {

    constructor() {
        this.commentService = new CommentService();
    }

    create = async (req, res) => {
        try {
            const { profileId } = req.params;
            const { nickname, content } = req.body;

            let visitorToken = req.headers['x-visitor-token'];

            if (!visitorToken) {
                visitorToken = generateVisitorToken();
            }

            const result =
                await this.commentService.createComment(
                    profileId,
                    visitorToken,
                    nickname,
                    content
                );

            res.setHeader(
                'x-visitor-token',
                visitorToken
            );

            return res.status(201).json({
                success: true,
                message: 'Comentario enviado correctamente. Está pendiente de moderación.',
                data: result
            });

        } catch (error) {

            console.error(
                'Error al crear comentario:',
                error
            );

            const validationErrors = [
                'El visitor token es obligatorio',
                'El comentario es obligatorio',
                'El comentario no puede superar los 500 caracteres',
                'El nickname no puede superar los 100 caracteres'
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

    getApprovedByProfile = async (req, res) => {
        try {
            const { profileId } = req.params;

            const comments =
                await this.commentService.getApprovedComments(
                    profileId
                );

            return res.status(200).json({
                success: true,
                data: comments
            });

        } catch (error) {

            console.error(
                'Error al obtener comentarios:',
                error
            );

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
            await this.commentService.updateStatus(
                id,
                status
            );

        return res.status(200).json({
            success: true,
            message: 'Estado del comentario actualizado correctamente',
            data: result
        });

    } catch (error) {

        console.error(
            'Error al actualizar comentario:',
            error
        );

        if (
            error.message === 'Estado de comentario no válido' ||
            error.message === 'Comentario no encontrado'
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
            await this.commentService.deleteComment(id);

        return res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
            data: result
        });

    } catch (error) {

        console.error(
            'Error al eliminar comentario:',
            error
        );

        if (error.message === 'Comentario no encontrado') {
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

module.exports = CommentController;