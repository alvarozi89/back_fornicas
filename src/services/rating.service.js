const db = require('../models');
const RatingRepository = require('../repositories/rating.repository');
const NotificationService = require('./notification.service');
const EmailService = require('./email.service');
const ProfileRepository = require('../repositories/profile.repository');
class RatingService {

    constructor() {
        this.ratingRepository = new RatingRepository(db);
        this.notificationService = new NotificationService();
        this.emailService = new EmailService();
        this.profileRepository = new ProfileRepository(db);
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
        throw new Error('Ya has calificado este perfil');
    }

    const newRating = await this.ratingRepository.create({
    profile_id: profileId,
    visitor_token: visitorToken,
    rating,
    status: 'PENDING'
});

    await this.notificationService.createNotification(
        profileId,
        'RATING',
        'Nueva calificación',
        `Tu perfil ha recibido una calificación de ${rating} de 5 estrellas.`
    );

    
const profile = await this.profileRepository.findById(profileId);

if (profile && profile.user && profile.user.email) {
    try {
        await this.emailService.sendEmail(
            profile.user.email,
            'Nueva calificación en tu perfil - Fornicas',
            `Hola ${profile.name},\n\nTu perfil de Fornicas ha recibido una nueva calificación de ${rating} de 5 estrellas.\n\nIngresa a Fornicas para revisar la actividad de tu perfil.`
        );
    } catch (error) {
        console.error(
            'Error enviando correo de calificación:',
            error.message
        );
    }
}

    return newRating;
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