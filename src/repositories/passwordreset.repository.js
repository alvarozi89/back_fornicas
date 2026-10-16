
class PasswordResetRepository {
    constructor(models) {
        this.PasswordReset = models.PasswordReset;
    }

    async create(data, transaction) {
        return await this.PasswordReset.create(data, { transaction });
    }

    async findValidByTokenHash(tokenHash) {
        return await this.PasswordReset.findOne({
            where: {
                token_hash: tokenHash,
                used_at: null
            }
        });
    }

    async invalidatePendingByUserId(userId, transaction) {
        return await this.PasswordReset.update(
            { used_at: new Date() },
            {
                where: {
                    user_id: userId,
                    used_at: null
                },
                transaction
            }
        );
    }

    async markAsUsed(id, transaction) {
        const reset = await this.PasswordReset.findByPk(id, { transaction });

        if (!reset) {
            return null;
        }

        await reset.update({ used_at: new Date() }, { transaction });

        return reset;
    }
}

module.exports = PasswordResetRepository;
