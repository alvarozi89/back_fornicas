const db = require('../models');
const CommentRepository = require('../repositories/comment.repository');
const NotificationService = require('./notification.service');
const EmailService = require('./email.service');
const ProfileRepository = require('../repositories/profile.repository');

class CommentService {

    constructor() {
        this.commentRepository = new CommentRepository(db);
        this.notificationService = new NotificationService();
        this.emailService = new EmailService();
        this.profileRepository = new ProfileRepository(db);
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
        throw new Error('El comentario no puede superar los 500 caracteres');
    }

    
    if (typeof nickname !== 'string' || !nickname.trim()) {
        throw new Error('El apodo es obligatorio');
    }

    const cleanNickname = nickname.trim();

    if (cleanNickname.length > 100) {
        throw new Error('El apodo no puede superar los 100 caracteres');
    }



    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    const comment = await this.commentRepository.create({
        profile_id: profileId,
        visitor_token: visitorToken,
        nickname: cleanNickname,
        content: cleanContent,
        status: 'PENDING'
    });

    await this.notificationService.createNotification(
        profileId,
        'COMMENT',
        'Nuevo comentario',
        'Alguien ha dejado un comentario en tu perfil. Está pendiente de moderación.'
    );

    if (profile.user && profile.user.email) {
        try {
            await this.emailService.sendEmail(
                profile.user.email,
                'Nuevo comentario en tu perfil - Fornicas',
                `Hola ${profile.name},\n\nHas recibido un nuevo comentario en tu perfil de Fornicas.\n\nComentario: ${cleanContent}\n\nEste comentario está pendiente de moderación.\n\nIngresa a Fornicas para revisar la actividad de tu perfil.`
            );
        } catch (error) {
            console.error('Error enviando correo de comentario:', error.message);
        }
    }

    return comment;
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

    

async moderateReview(commentId, userId, status) {
    const allowedStatuses = ['APPROVED', 'REJECTED'];

    if (!allowedStatuses.includes(status)) {
        throw new Error('Estado de moderación no válido');
    }

    const transaction = await db.sequelize.transaction();

    try {
        const comment = await db.Comment.findByPk(commentId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        if (comment.status !== 'PENDING') {
            throw new Error('Este comentario ya fue moderado');
        }

        const profile = await db.Profile.findByPk(comment.profile_id, {
            transaction
        });

        if (!profile || Number(profile.user_id) !== Number(userId)) {
            throw new Error('No tienes permiso para moderar este comentario');
        }

        const rating = await db.Rating.findOne({
            where: {
                profile_id: comment.profile_id,
                visitor_token: comment.visitor_token
            },
            order: [['created_at', 'DESC']],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (rating && rating.status === 'PENDING') {
            await rating.update({ status }, { transaction });
        }

        await comment.update({ status }, { transaction });

        await transaction.commit();

        return { comment, rating };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
    async deleteComment(id) {

        const comment =
            await this.commentRepository.delete(id);

        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        return comment;
    }

    

async getPendingComments(profileId, userId) {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    if (Number(profile.user_id) !== Number(userId)) {
        throw new Error('No tienes permiso para ver estos comentarios');
    }

    return await this.commentRepository.findPendingByProfile(profileId);
}
}

module.exports = CommentService;