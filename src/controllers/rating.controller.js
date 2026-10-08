const RatingService = require('../services/rating.service');
const { generateVisitorToken } = require('../utils/visitor-token');

class RatingController {

    constructor() {
        this.ratingService = new RatingService();
    }

    create = async (req, res) => {
        try {
            const { profileId } = req.params;
            const { rating } = req.body;

            let visitorToken = req.headers['x-visitor-token'];

            if (!visitorToken) {
                visitorToken = generateVisitorToken();
            }

            const result = await this.ratingService.createRating(
                profileId,
                visitorToken,
                rating
            );

            res.setHeader(
                'x-visitor-token',
                visitorToken
            );

            return res.status(201).json({
                success: true,
                message: 'Calificación registrada correctamente',
                data: result
            });

        } catch (error) {

            console.error(
                'Error al registrar calificación:',
                error
            );

            if (
                error.message === 'Ya has calificado este perfil' ||
                error.message === 'La calificación es obligatoria' ||
                error.message === 'La calificación debe estar entre 1 y 5' ||
                error.message === 'El visitor token es obligatorio'
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    getProfileRating = async (req, res) => {
        try {
            const { profileId } = req.params;

            const result =
                await this.ratingService.getProfileRating(
                    profileId
                );

            return res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            console.error(
                'Error al obtener calificación:',
                error
            );

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
}

module.exports = RatingController;