class PaymentRepository {

    constructor(models) {
        this.Payment = models.Payment;
    }

    async create(data, transaction) {
        return await this.Payment.create(data, {
            transaction
        });
    }

   async findById(id, transaction) {
    return await this.Payment.findByPk(id, {
        transaction
    });
}

    async findByProfileId(profileId) {
        return await this.Payment.findAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['payment_date', 'DESC']
            ]
        });
    }

   async updateStatus(id, status, transaction) {
    const payment = await this.Payment.findByPk(id, {
        transaction
    });

    if (!payment) {
        return null;
    }

    await payment.update(
        {
            status
        },
        {
            transaction
        }
    );

    return payment;
}
    async findByReference(reference) {
    return await this.Payment.findOne({
        where: {
            reference
        }
    });
}
async findPending() {
    return await this.Payment.findAll({
        where: {
            status: 'PENDING'
        },
        order: [
            ['payment_date', 'ASC']
        ]
    });
}
async findPendingByProfileId(profileId) {
    return await this.Payment.findOne({
        where: {
            profile_id: profileId,
            status: 'PENDING'
        },
        order: [
            ['payment_date', 'DESC']
        ]
    });
}
async approve(id, subscriptionId, transaction) {
    const payment = await this.Payment.findByPk(id, {
        transaction
    });

    if (!payment) {
        return null;
    }

    await payment.update(
        {
            subscription_id: subscriptionId,
            status: 'APPROVED'
        },
        {
            transaction
        }
    );

    return payment;
}
async reject(id, transaction) {
    const payment = await this.Payment.findByPk(id, {
        transaction
    });

    if (!payment) {
        return null;
    }

    await payment.update(
        {
            status: 'REJECTED'
        },
        {
            transaction
        }
    );

    return payment;
}
}

module.exports = PaymentRepository;