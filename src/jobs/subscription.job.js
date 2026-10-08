const cron = require('node-cron');
const SubscriptionService = require('../services/subscription.service');

const subscriptionService = new SubscriptionService();

const startSubscriptionJob = () => {

    cron.schedule('*/5 * * * *', async () => {

        try {

            const result =
                await subscriptionService.updateSubscriptionStatuses();

            console.log(
                'Job de suscripciones ejecutado:',
                result
            );

        } catch (error) {

            console.error(
                'Error en job de suscripciones:',
                error
            );
        }
    });

    console.log(
        'Job de suscripciones iniciado. Ejecución cada 5 minutos.'
    );
};

module.exports = startSubscriptionJob;