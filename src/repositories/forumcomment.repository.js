'use strict';

class ForumCommentRepository {
    constructor(models) {
        this.ForumComment = models.ForumComment;
    }

    async create(data) {
        return await this.ForumComment.create(data);
    }

    async findById(id, options = {}) {
        return await this.ForumComment.findByPk(id, options);
    }

    async updateStatus(id, status) {
        const comment = await this.ForumComment.findByPk(id);
        if (!comment) return null;
        await comment.update({ status });
        return comment;
    }
}

module.exports = ForumCommentRepository;