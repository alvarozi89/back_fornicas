class CommentRepository {

    constructor(models) {
        this.Comment = models.Comment;
    }

    async create(data) {
        return await this.Comment.create(data);
    }

    async findById(id) {
        return await this.Comment.findByPk(id);
    }

    async findApprovedByProfile(profileId) {
        return await this.Comment.findAll({
            where: {
                profile_id: profileId,
                status: 'APPROVED'
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    
    async findPendingByProfile(profileId) {
        return await this.Comment.findAll({
            where: {
                profile_id: profileId,
                status: 'PENDING'
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async findAllByProfile(profileId) {
        return await this.Comment.findAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async updateStatus(id, status) {
        const comment = await this.Comment.findByPk(id);

        if (!comment) {
            return null;
        }

        await comment.update({
            status
        });

        return comment;
    }

    async delete(id) {
        const comment = await this.Comment.findByPk(id);

        if (!comment) {
            return null;
        }

        await comment.destroy();

        return comment;
    }
}

module.exports = CommentRepository;