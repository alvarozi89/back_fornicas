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

    async update(id, data) {
        const user = await this.User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.update(data);

        return user;
    }
}

module.exports = UserRepository;