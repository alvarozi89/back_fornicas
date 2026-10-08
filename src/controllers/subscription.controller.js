const SubscriptionService = require('../services/subscription.service');

class SubscriptionController {

    constructor() {
        this.subscriptionService = new SubscriptionService();
    }

    getMySubscriptions = async (req, res) => {
        try {

            const userId = req.user.id;

            const subscriptions =
                await this.subscriptionService.getMySubscriptions(userId);

            return res.status(200).json({
                success: true,
                data: subscriptions
            });

        } catch (error) {

            console.error(
                'Error al obtener suscripciones:',
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    getActiveSubscription = async (req, res) => {
        try {

            const userId = req.user.id;

            const subscription =
                await this.subscriptionService.getActiveSubscription(
                    userId
                );

            return res.status(200).json({
                success: true,
                data: subscription
            });

        } catch (error) {

            console.error(
                'Error al obtener suscripción activa:',
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };
    updateStatuses = async (req, res) => {
    try {

        const result =
            await this.subscriptionService.updateSubscriptionStatuses();

        return res.status(200).json({
            success: true,
            message: 'Estados de suscripciones actualizados correctamente',
            data: result
        });

    } catch (error) {

        console.error(
            'Error al actualizar estados de suscripciones:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
}

module.exports = SubscriptionController;