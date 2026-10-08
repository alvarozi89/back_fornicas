class RatingRepository {

    constructor(models) {
        this.Rating = models.Rating;
    }

    async create(data) {
        return await this.Rating.create(data);
    }

    async findByProfileAndVisitor(profileId, visitorToken) {
        return await this.Rating.findOne({
            where: {
                profile_id: profileId,
                visitor_token: visitorToken
            }
        });
    }

    async findAllByProfile(profileId) {
        return await this.Rating.findAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    async getAverageByProfile(profileId) {
        const result = await this.Rating.findOne({
            attributes: [
                [
                    this.Rating.sequelize.fn(
                        'AVG',
                        this.Rating.sequelize.col('rating')
                    ),
                    'average'
                ]
            ],
            where: {
                profile_id: profileId
            },
            raw: true
        });

        return result?.average
            ? Number(result.average)
            : 0;
    }

    async countByProfile(profileId) {
        return await this.Rating.count({
            where: {
                profile_id: profileId
            }
        });
    }
}

module.exports = RatingRepository;