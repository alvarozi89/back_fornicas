class PhotoRepository {

    constructor(models) {
        this.Photo = models.Photo;
    }

    async create(data, transaction) {
    return await this.Photo.create(data, {
        transaction
    });
}

    async findById(id) {
        return await this.Photo.findByPk(id);
    }

    async findByProfileId(profileId) {
        return await this.Photo.findAll({
            where: {
                profile_id: profileId
            },
            order: [
                ['sort_order', 'ASC'],
                ['created_at', 'ASC']
            ]
        });
    }

   async update(id, data, transaction) {
    const photo = await this.Photo.findByPk(id, {
        transaction
    });

    if (!photo) {
        return null;
    }

    await photo.update(data, {
        transaction
    });

    return photo;
}

    async delete(id) {
        const photo = await this.Photo.findByPk(id);

        if (!photo) {
            return null;
        }

        await photo.destroy();

        return photo;
    }

    async unsetMainPhotos(profileId, transaction) {
    await this.Photo.update(
        {
            is_main: false
        },
        {
            where: {
                profile_id: profileId
            },
            transaction
        }
    );
}
    
}

module.exports = PhotoRepository;