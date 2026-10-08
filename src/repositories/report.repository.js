class ReportRepository {

    constructor(models) {
        this.Report = models.Report;
    }

    async create(data) {
        return await this.Report.create(data);
    }

    async findByVisitorAndComment(visitorToken, commentId) {
    return await this.Report.findOne({
        where: {
            visitor_token: visitorToken,
            comment_id: commentId
        }
    });
}

    async findById(id) {
        return await this.Report.findByPk(id);
    }

    async findAll() {
        return await this.Report.findAll({
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async findAllByStatus(status) {
        return await this.Report.findAll({
            where: {
                status
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async updateStatus(id, status) {
        const report = await this.Report.findByPk(id);

        if (!report) {
            return null;
        }

        await report.update({
            status
        });

        return report;
    }

    async delete(id) {
        const report = await this.Report.findByPk(id);

        if (!report) {
            return null;
        }

        await report.destroy();

        return report;
    }
}

module.exports = ReportRepository;