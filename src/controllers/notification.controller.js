
const NotificationService = require('../services/notification.service');

class NotificationController {

    constructor() {
        this.notificationService = new NotificationService();
    }

    getMyNotifications = async (req, res) => {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;

            const result = await this.notificationService.getMyNotifications(
                userId,
                page,
                limit
            );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    getUnreadCount = async (req, res) => {
        try {
            const userId = req.user.id;

            const count = await this.notificationService.getUnreadCount(userId);

            return res.status(200).json({
                success: true,
                data: {
                    unread: count
                }
            });
        } catch (error) {
            console.error('Error al contar notificaciones:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    markAsRead = async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const notification = await this.notificationService.markAsRead(
                userId,
                id
            );

            return res.status(200).json({
                success: true,
                message: 'Notificación marcada como leída',
                data: notification
            });
        } catch (error) {
            console.error('Error al marcar notificación:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    markAllAsRead = async (req, res) => {
        try {
            const userId = req.user.id;

            const result = await this.notificationService.markAllAsRead(userId);

            return res.status(200).json({
                success: true,
                message: 'Notificaciones marcadas como leídas',
                data: result
            });
        } catch (error) {
            console.error('Error al marcar notificaciones:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = NotificationController;