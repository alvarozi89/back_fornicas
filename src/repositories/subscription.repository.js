class SubscriptionRepository {

    constructor(models) {
        this.Subscription = models.Subscription;
    }

    async create(data, transaction) {
        return await this.Subscription.create(data, {
            transaction
        });
    }

  async findActiveByProfileId(profileId) {
    const now = new Date();

    return await this.Subscription.findOne({
        where: {
            profile_id: profileId,
            status: 'ACTIVE',
            start_date: {
                [this.Subscription.sequelize.Sequelize.Op.lte]: now
            },
            end_date: {
                [this.Subscription.sequelize.Sequelize.Op.gt]: now
            }
        },
        order: [['end_date', 'DESC']]
    });
}

  async findById(id, transaction) {
    return await this.Subscription.findByPk(id, {
        transaction
    });
}

    async findByProfileId(profileId) {
    return await this.Subscription.findAll({
        where: {
            profile_id: profileId
        },
        order: [
            ['start_date', 'DESC']
        ]
    });
}
async updateStatus(id, status) {
    const subscription = await this.Subscription.findByPk(id);

    if (!subscription) {
        return null;
    }

    await subscription.update({
        status
    });

    return subscription;
}
async findLatestByProfileId(profileId, transaction) {
    return await this.Subscription.findOne({
        where: {
            profile_id: profileId
        },
        order: [
            ['end_date', 'DESC']
        ],
        transaction
    });
}
async findActiveByProfileIdWithTransaction(profileId, transaction) {
    return await this.Subscription.findOne({
        where: {
            profile_id: profileId,
            status: 'ACTIVE'
        },
        order: [
            ['end_date', 'DESC']
        ],
        transaction
    });
}
async findPendingToActivate(now, transaction) {
    return await this.Subscription.findAll({
        where: {
            status: 'PENDING',
            start_date: {
                [this.Subscription.sequelize.Sequelize.Op.lte]: now
            }
        },
        transaction
    });
}

async findActiveToExpire(now, transaction) {
    return await this.Subscription.findAll({
        where: {
            status: 'ACTIVE',
            end_date: {
                [this.Subscription.sequelize.Sequelize.Op.lte]: now
            }
        },
        transaction
    });
}
}

module.exports = SubscriptionRepository;