
const db = require('../models');
const NotificationRepository = require('../repositories/notification.repository');
const ProfileRepository = require('../repositories/profile.repository');

class NotificationService {

    constructor() {
        this.notificationRepository = new NotificationRepository(db);
        this.profileRepository = new ProfileRepository(db);
    }

    async getMyNotifications(userId, page = 1, limit = 20) {
        page = Number(page);
        limit = Number(limit);

        if (!Number.isInteger(page) || page < 1) {
            throw new Error('La página debe ser mayor o igual a 1');
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
            throw new Error('El límite debe estar entre 1 y 50');
        }

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        const offset = (page - 1) * limit;

        const result = await this.notificationRepository.findByProfileId(
            profile.id,
            limit,
            offset
        );

        return {
            notifications: result.rows,
            pagination: {
                page,
                limit,
                total: result.count,
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }

    async getUnreadCount(userId) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        return await this.notificationRepository.countUnreadByProfileId(
            profile.id
        );
    }

    async markAsRead(userId, notificationId) {
        if (!Number.isInteger(Number(notificationId)) ||
            Number(notificationId) < 1) {
            throw new Error('El ID de la notificación no es válido');
        }

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        const notification =
            await this.notificationRepository.findByIdAndProfileId(
                Number(notificationId),
                profile.id
            );

        if (!notification) {
            throw new Error('Notificación no encontrada');
        }

        return await this.notificationRepository.markAsRead(notification);
    }

    async markAllAsRead(userId) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        const result =
            await this.notificationRepository.markAllAsRead(profile.id);

        return {
            updated: result[0]
        };
    }

    
    async createNotification(profileId, type, title, message) {
        if (!profileId || !Number.isInteger(Number(profileId)) ||
            Number(profileId) < 1) {
            throw new Error('El perfil destinatario no es válido');
        }

        const allowedTypes = [
            'COMMENT',
            'RATING',
            'REGISTRATION',
            'PAYMENT',
            'SUBSCRIPTION'
        ];

        if (!allowedTypes.includes(type)) {
            throw new Error('Tipo de notificación no válido');
        }

        if (!title || !title.trim()) {
            throw new Error('El título de la notificación es obligatorio');
        }

        if (!message || !message.trim()) {
            throw new Error('El mensaje de la notificación es obligatorio');
        }

        return await this.notificationRepository.create({
            profile_id: Number(profileId),
            type,
            title: title.trim(),
            message: message.trim(),
            is_read: false
        });
    }
}

module.exports = NotificationService;