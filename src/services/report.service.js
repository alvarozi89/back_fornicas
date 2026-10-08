const db = require('../models');
const ReportRepository = require('../repositories/report.repository');

class ReportService {

    constructor() {
        this.reportRepository = new ReportRepository(db);
    }

    async createReport(
        profileId,
        commentId,
        visitorToken,
        reason,
        description
    ) {

        if (!visitorToken) {
            throw new Error(
                'El visitor token es obligatorio'
            );
        }
        if (commentId) {

    const existingReport =
        await this.reportRepository.findByVisitorAndComment(
            visitorToken,
            commentId
        );

    if (existingReport) {
        throw new Error(
            'Ya has reportado este comentario'
        );
    }
}

        if (!reason || !reason.trim()) {
            throw new Error(
                'El motivo del reporte es obligatorio'
            );
        }

        const cleanReason = reason.trim();

        if (cleanReason.length > 150) {
            throw new Error(
                'El motivo del reporte no puede superar los 150 caracteres'
            );
        }

        let cleanDescription = null;

        if (
            description !== undefined &&
            description !== null
        ) {
            cleanDescription = description.trim();

            if (cleanDescription.length > 1000) {
                throw new Error(
                    'La descripción no puede superar los 1000 caracteres'
                );
            }

            if (!cleanDescription) {
                cleanDescription = null;
            }
        }

        return await this.reportRepository.create({
            profile_id: profileId,
            comment_id: commentId || null,
            visitor_token: visitorToken,
            reason: cleanReason,
            description: cleanDescription,
            status: 'PENDING'
        });
    }

    async getAllReports() {

        return await this.reportRepository.findAll();
    }

    async getReportsByStatus(status) {

        const allowedStatuses = [
            'PENDING',
            'REVIEWED',
            'RESOLVED',
            'REJECTED'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error(
                'Estado de reporte no válido'
            );
        }

        return await this.reportRepository.findAllByStatus(
            status
        );
    }

    async updateStatus(id, status) {

        const allowedStatuses = [
            'PENDING',
            'REVIEWED',
            'RESOLVED',
            'REJECTED'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error(
                'Estado de reporte no válido'
            );
        }

        const report =
            await this.reportRepository.updateStatus(
                id,
                status
            );

        if (!report) {
            throw new Error(
                'Reporte no encontrado'
            );
        }

        return report;
    }

    async deleteReport(id) {

        const report =
            await this.reportRepository.delete(id);

        if (!report) {
            throw new Error(
                'Reporte no encontrado'
            );
        }

        return report;
    }
}

module.exports = ReportService;