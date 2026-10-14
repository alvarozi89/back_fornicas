
class NotificationRepository {

    constructor(models) {
        this.Notification = models.Notification;
    }

    async create(data, transaction) {
        return await this.Notification.create(data, {
            transaction
        });
    }

    async findByProfileId(profileId, limit = 20, offset = 0) {
        return await this.Notification.findAndCountAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
    }

    async countUnreadByProfileId(profileId) {
        return await this.Notification.count({
            where: {
                profile_id: profileId,
                is_read: false
            }
        });
    }

    async findByIdAndProfileId(id, profileId) {
        return await this.Notification.findOne({
            where: {
                id,
                profile_id: profileId
            }
        });
    }

    async markAsRead(notification) {
        await notification.update({
            is_read: true
        });

        return notification;
    }

    async markAllAsRead(profileId) {
        return await this.Notification.update(
            {
                is_read: true
            },
            {
                where: {
                    profile_id: profileId,
                    is_read: false
                }
            }
        );
    }
}

module.exports = NotificationRepository;