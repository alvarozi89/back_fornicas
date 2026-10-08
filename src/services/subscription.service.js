const db = require('../models');
const SubscriptionRepository = require('../repositories/subscription.repository');
const ProfileRepository = require('../repositories/profile.repository');

class SubscriptionService {

    constructor() {
        this.subscriptionRepository = new SubscriptionRepository(db);
        this.profileRepository = new ProfileRepository(db);
    }

    async getMySubscriptions(userId) {

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        return await this.subscriptionRepository.findByProfileId(
            profile.id
        );
    }

    async getActiveSubscription(userId) {

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    const subscription =
        await this.subscriptionRepository.findActiveByProfileId(
            profile.id
        );

    if (!subscription) {
        return null;
    }

    const now = new Date();

    if (now > subscription.end_date) {

        await this.subscriptionRepository.updateStatus(
            subscription.id,
            'EXPIRED'
        );

        return null;
    }

    return subscription;
}
async createPaidSubscription(profileId, paymentData) {

    const transaction = await db.sequelize.transaction();

    try {

        const profile = await this.profileRepository.findById(profileId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        const amount = 30000;

        if (Number(paymentData.amount) !== amount) {
            throw new Error('El valor del pago no es válido');
        }

        const startDate = new Date();

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription =
            await this.subscriptionRepository.create(
                {
                    profile_id: profileId,
                    type: 'PAID',
                    status: 'ACTIVE',
                    start_date: startDate,
                    end_date: endDate,
                    amount
                },
                transaction
            );

        await transaction.commit();

        return subscription;

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
}
async updateSubscriptionStatuses() {

    const now = new Date();

    // 1. Buscar suscripciones activas que ya vencieron
    const activeSubscriptions =
        await this.subscriptionRepository.findActiveToExpire(now);

    for (const subscription of activeSubscriptions) {

        await this.subscriptionRepository.updateStatus(
            subscription.id,
            'EXPIRED'
        );

        // Desactivar perfil
        await this.profileRepository.update(
            subscription.profile_id,
            {
                status: 'INACTIVE'
            }
        );
    }

    // 2. Buscar suscripciones pendientes que ya pueden activarse
    const pendingSubscriptions =
        await this.subscriptionRepository.findPendingToActivate(now);

    for (const subscription of pendingSubscriptions) {

        await this.subscriptionRepository.updateStatus(
            subscription.id,
            'ACTIVE'
        );

        // Activar perfil
        await this.profileRepository.update(
            subscription.profile_id,
            {
                status: 'ACTIVE'
            }
        );
    }

    return {
        activated: pendingSubscriptions.length,
        expired: activeSubscriptions.length
    };
}
}

module.exports = SubscriptionService;