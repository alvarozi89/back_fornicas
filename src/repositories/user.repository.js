class UserRepository {

    constructor(models) {
        this.User = models.User;
    }

    async findById(id) {
        return await this.User.findByPk(id);
    }

    async findByEmail(email) {
        return await this.User.findOne({
            where: {
                email
            }
        });
    }

    async existsByEmail(email) {
        const user = await this.User.findOne({
            where: {
                email
            },
            attributes: ['id']
        });

        return !!user;
    }

 async create(data, transaction) {
    return await this.User.create(data, {
        transaction
    });
}

   async update(id, data, transaction = null) {
    const user = await this.User.findByPk(id, { transaction });

    if (!user) {
        return null;
    }

    await user.update(data, { transaction });

    return user;
}
}

module.exports = UserRepository;