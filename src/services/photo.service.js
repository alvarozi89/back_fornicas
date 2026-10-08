const db = require('../models');
const fs = require('fs');
const path = require('path');
const PhotoRepository = require('../repositories/photo.repository');
const ProfileRepository = require('../repositories/profile.repository');

class PhotoService {

    constructor() {
        this.photoRepository = new PhotoRepository(db);
        this.profileRepository = new ProfileRepository(db);
    }

    async create(userId, data) {

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

       if (!data || !data.filename) {
    throw new Error('La foto es obligatoria');
        }

       const photos = await this.photoRepository.findByProfileId(
            profile.id
        );

        if (photos.length >= 10) {
            throw new Error('Has alcanzado el límite máximo de 10 fotos');
        }

        const sortOrder = photos.length;

        const photo = await this.photoRepository.create({
        profile_id: profile.id,
        url: `/uploads/photos/${data.filename}`,
        is_main: photos.length === 0,
        sort_order: sortOrder
    });

        return photo;
    }

    async getByProfileId(profileId) {

    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    return await this.photoRepository.findByProfileId(profileId);
}

async delete(userId, photoId) {

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    const photo = await this.photoRepository.findById(photoId);

    if (!photo) {
        throw new Error('Foto no encontrada');
    }

    if (photo.profile_id !== profile.id) {
        throw new Error('No tienes permiso para eliminar esta foto');
    }

    const filePath = path.join(
    __dirname,
    '../../',
        photo.url
    );

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await this.photoRepository.delete(photoId);

return photo;
}

async setMain(userId, photoId) {

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    const photo = await this.photoRepository.findById(photoId);

    if (!photo) {
        throw new Error('Foto no encontrada');
    }

    if (photo.profile_id !== profile.id) {
        throw new Error('No tienes permiso para modificar esta foto');
    }

    const transaction = await db.sequelize.transaction();

    try {

        await this.photoRepository.unsetMainPhotos(
            profile.id,
            transaction
        );

    const updatedPhoto = await this.photoRepository.update(
    photoId,
    {
        is_main: true
    },
    transaction
);

        await transaction.commit();

        return updatedPhoto;

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
}
}

module.exports = PhotoService;