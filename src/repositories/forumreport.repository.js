'use strict';

class ForumReportRepository {
    constructor(models) {
        this.ForumReport = models.ForumReport;
    }

    async create(data) {
        return await this.ForumReport.create(data);
    }

    async findAllPending() {
        return await this.ForumReport.findAll({
            where: { status: 'PENDING' },
            order: [['created_at', 'DESC']]
        });
    }

    async updateStatus(id, status) {
        const report = await this.ForumReport.findByPk(id);
        if (!report) return null;
        await report.update({ status });
        return report;
    }
}

module.exports = ForumReportRepository;