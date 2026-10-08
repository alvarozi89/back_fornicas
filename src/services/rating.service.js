const db = require('../models');
const RatingRepository = require('../repositories/rating.repository');

class RatingService {

    constructor() {
        this.ratingRepository = new RatingRepository(db);
    }

    async createRating(profileId, visitorToken, rating) {

        if (!visitorToken) {
            throw new Error('El visitor token es obligatorio');
        }

        if (!rating) {
            throw new Error('La calificación es obligatoria');
        }

        if (rating < 1 || rating > 5) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }

        const existingRating =
            await this.ratingRepository.findByProfileAndVisitor(
                profileId,
                visitorToken
            );

        if (existingRating) {
            throw new Error(
                'Ya has calificado este perfil'
            );
        }

        return await this.ratingRepository.create({
            profile_id: profileId,
            visitor_token: visitorToken,
            rating
        });
    }

    async getProfileRating(profileId) {

        const average =
            await this.ratingRepository.getAverageByProfile(
                profileId
            );

        const total =
            await this.ratingRepository.countByProfile(
                profileId
            );

        return {
            average,
            total
        };
    }
}

module.exports = RatingService;