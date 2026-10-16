'use strict';
const db = require('../models');
class ForumTopicRepository {
    constructor(models) {
        this.ForumTopic = models.ForumTopic;
        this.City = models.City; // <-- Añadimos la referencia al modelo City
    }

    async create(data) {
        return await this.ForumTopic.create(data);
    }

async findById(id) {
    return await db.ForumTopic.findByPk(id, {
      include: [
        {
          model: db.City,
          as: 'city',
          attributes: ['id', 'name', 'code']
        },
        {
          model: db.ForumComment,
          as: 'comments',
          required: false
        }
      ],
      order: [
        [{ model: db.ForumComment, as: 'comments' }, 'created_at', 'ASC']
      ]
    });
  }

    // Actualizado para soportar filtro opcional por cityId
    async findAllPublished(limit = 10, offset = 0, cityId = null) {
        const whereClause = { status: 'PUBLISHED' };

        if (cityId) {
            whereClause.city_id = cityId;
        }

        return await this.ForumTopic.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: this.City,
                    as: 'city',
                    attributes: ['id', 'name', 'code']
                }
            ]
        });
    }

    async updateStatus(id, status) {
        const topic = await this.ForumTopic.findByPk(id);
        if (!topic) return null;
        await topic.update({ status });
        return topic;
    }
}

module.exports = ForumTopicRepository;