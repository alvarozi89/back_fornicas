const db = require('../models');
const CommentRepository = require('../repositories/comment.repository');

class CommentService {

    constructor() {
        this.commentRepository = new CommentRepository(db);
    }

    async createComment(profileId, visitorToken, nickname, content) {

        if (!visitorToken) {
            throw new Error('El visitor token es obligatorio');
        }

        if (!content || !content.trim()) {
            throw new Error('El comentario es obligatorio');
        }

        const cleanContent = content.trim();

        if (cleanContent.length > 500) {
            throw new Error(
                'El comentario no puede superar los 500 caracteres'
            );
        }

        let cleanNickname = null;

        if (nickname !== undefined && nickname !== null) {
            cleanNickname = nickname.trim();

            if (cleanNickname.length > 100) {
                throw new Error(
                    'El nickname no puede superar los 100 caracteres'
                );
            }

            if (!cleanNickname) {
                cleanNickname = null;
            }
        }

        return await this.commentRepository.create({
            profile_id: profileId,
            visitor_token: visitorToken,
            nickname: cleanNickname,
            content: cleanContent,
            status: 'PENDING'
        });
    }

    async getApprovedComments(profileId) {

        return await this.commentRepository.findApprovedByProfile(
            profileId
        );
    }

    async getAllComments(profileId) {

        return await this.commentRepository.findAllByProfile(
            profileId
        );
    }

    async updateStatus(id, status) {

        const allowedStatuses = [
            'PENDING',
            'APPROVED',
            'REJECTED'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error('Estado de comentario no válido');
        }

        const comment =
            await this.commentRepository.updateStatus(
                id,
                status
            );

        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        return comment;
    }

    async deleteComment(id) {

        const comment =
            await this.commentRepository.delete(id);

        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        return comment;
    }
}

module.exports = CommentService;