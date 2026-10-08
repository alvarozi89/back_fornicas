
class VideoRepository {

    
    constructor(models) {
        this.Video = models.Video;
    }

    async create(data) {
        return await this.Video.create(data);
    }

    async findById(id) {
        return await this.Video.findByPk(id);
    }

    async findByProfileId(profileId) {
        return await this.Video.findAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['sort_order', 'ASC'],
                ['created_at', 'ASC']
            ]
        });
    }

    async update(id, data, transaction) {
        const video = await this.Video.findByPk(id, {
            transaction
        });

        if (!video) {
            return null;
        }

        await video.update(data, {
            transaction
        });

        return video;
    }

    async delete(id) {
        const video = await this.Video.findByPk(id);

        if (!video) {
            return null;
        }

        await video.destroy();

        return video;
    }
}

module.exports = VideoRepository;