'use strict';

const db = require('../models');
const ForumTopicRepository = require('../repositories/forumtopic.repository');

class ForumService {
    constructor() {
        this.forumTopicRepository = new ForumTopicRepository(db);
    }

    // --- Crear Tema ---
    async createTopic(data) {
        if (!data.title || !data.title.trim()) {
            throw new Error('El título es obligatorio');
        }

        if (!data.content || !data.content.trim()) {
            throw new Error('El contenido es obligatorio');
        }

        if (!data.nickname || !data.nickname.trim()) {
            throw new Error('El apodo es obligatorio');
        }

        if (!data.city_id) {
            throw new Error('La ciudad es obligatoria para crear un tema.');
        }

        const cleanData = {
            ...data,
            title: data.title.trim(),
            content: data.content.trim(),
            nickname: data.nickname.trim(),
            city_id: Number(data.city_id)
        };

        return await this.forumTopicRepository.create(cleanData);
    }

    // --- Obtener Tema por ID ---
    async getTopicById(id) {
        const topic = await this.forumTopicRepository.findById(id);
        if (!topic) {
            throw new Error('Tema no encontrado');
        }
        return topic;
    }

    // --- Obtener/Listar Temas (Con paginación y filtro por ciudad) ---
    async getTopics(page = 1, limit = 10, cityId = null) {
        const parsedLimit = Number(limit) || 10;
        const parsedPage = Number(page) || 1;
        const offset = (parsedPage - 1) * parsedLimit;
        
        const parsedCityId = cityId ? Number(cityId) : null;

        const { count, rows } = await this.forumTopicRepository.findAllPublished(
            parsedLimit, 
            offset, 
            parsedCityId
        );

        return {
            topics: rows,
            total: count,
            totalPages: Math.ceil(count / parsedLimit),
            currentPage: parsedPage,
            limit: parsedLimit
        };
    }

    // --- Crear Comentario en Tema ---
    async createComment(topicId, data) {
        const topic = await this.getTopicById(topicId);
        
        if (!data.content || !data.content.trim()) {
            throw new Error('El comentario es obligatorio');
        }
        if (!data.nickname || !data.nickname.trim()) {
            throw new Error('El apodo es obligatorio');
        }

        // Usamos el modelo ForumComment directamente desde db
        return await db.ForumComment.create({
            topic_id: topic.id,
            nickname: data.nickname.trim(),
            content: data.content.trim(),
            visitor_token: data.visitor_token || null,
            status: 'PUBLISHED' // o 'PENDING' según tu lógica de moderación
        });
    }

    // --- Reportar un Tema ---
    async createTopicReport(topicId, data) {
        const topic = await this.getTopicById(topicId);

        return await db.ForumReport.create({
            topic_id: topic.id,
            reason: data.reason || 'Sin razón especificada',
            visitor_token: data.visitor_token || null,
            status: 'PENDING'
        });
    }

    // --- Reportar un Comentario ---
    async createCommentReport(commentId, data) {
        const comment = await db.ForumComment.findByPk(commentId);
        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        return await db.ForumReport.create({
            comment_id: comment.id,
            reason: data.reason || 'Sin razón especificada',
            visitor_token: data.visitor_token || null,
            status: 'PENDING'
        });
    }

    // --- Obtener Reportes Pendientes (Administración) ---
    async getPendingReports() {
        return await db.ForumReport.findAll({
            where: { status: 'PENDING' },
            include: [
                { model: db.ForumTopic, as: 'topic', required: false },
                { model: db.ForumComment, as: 'comment', required: false }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    // --- Cambiar Estado de un Tema ---
    async updateTopicStatus(id, status) {
        const allowedStatuses = ['PUBLISHED', 'HIDDEN', 'DELETED'];
        if (!allowedStatuses.includes(status)) {
            throw new Error('Estado del tema no válido');
        }

        const updated = await this.forumTopicRepository.updateStatus(id, status);
        if (!updated) {
            throw new Error('Tema no encontrado');
        }
        return updated;
    }

    // --- Cambiar Estado de un Comentario ---
    async updateCommentStatus(commentId, status) {
        const allowedStatuses = ['PUBLISHED', 'HIDDEN', 'DELETED'];
        if (!allowedStatuses.includes(status)) {
            throw new Error('Estado del comentario no válido');
        }

        const comment = await db.ForumComment.findByPk(commentId);
        if (!comment) {
            throw new Error('Comentario no encontrado');
        }

        await comment.update({ status });
        return comment;
    }
}

module.exports = ForumService;