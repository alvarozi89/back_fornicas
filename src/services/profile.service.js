const db = require('../models');
const ProfileRepository = require('../repositories/profile.repository');
const RatingService = require('./rating.service');
const CommentService = require('./comment.service');

class ProfileService {

    constructor() {
        this.profileRepository = new ProfileRepository(db);
        this.ratingService = new RatingService();
        this.commentService = new CommentService();
    }

  async getById(id, visitorToken = null) {
    const profile = await this.profileRepository.findPublicById(id);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    if (visitorToken) {
        const hasViewed = await this.profileRepository.hasViewed(
            id,
            visitorToken
        );

        if (!hasViewed) {
            await this.profileRepository.createView(
                id,
                visitorToken
            );
        }
    }

   const views = await this.profileRepository.countViews(id);

    const rating = await this.ratingService.getProfileRating(id);

    const comments = await this.commentService.getApprovedComments(id);

    return {
        profile,
        views,
        rating,
        comments
    };
}

async getAllActive(page = 1, limit = 12, filters = {}) {

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error('La página debe ser un número mayor o igual a 1');
    }

    if (!Number.isInteger(limit) || limit < 1) {
        throw new Error('El límite debe ser un número mayor o igual a 1');
    }

    if (limit > 24) {
        throw new Error('El límite máximo por página es 24');
    }

    if (
    filters.departmentId !== undefined &&
    (
        !Number.isInteger(Number(filters.departmentId)) ||
        Number(filters.departmentId) < 1
    )
) {
    throw new Error('El departamento no es válido');
}

    if (
        filters.cityId !== undefined &&
        (
            !Number.isInteger(Number(filters.cityId)) ||
            Number(filters.cityId) < 1
        )
    ) {
        throw new Error('La ciudad no es válida');
    }

    const offset = (page - 1) * limit;

    const result = await this.profileRepository.findAllActive(
        limit,
        offset,
        filters
    );

   const total = result.count;
const totalPages = Math.ceil(total / limit);

const profiles = await Promise.all(
    result.rows.map(async (profile) => {
        const rating = await this.ratingService.getProfileRating(profile.id);

        return {
            ...profile.toJSON(),
            rating
        };
    })
);

return {
    profiles,
    pagination: {
        page,
        limit,
        total,
        totalPages
    }
};
}

    async getMyProfile(userId) {
        
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
        throw new Error('Perfil no encontrado service');
    }

    return profile;
}

async updateMyProfile(userId, data) {

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    const allowedFields = {
        name: data.name,
        nickname: data.nickname,
        title: data.title,
        birth_date: data.birth_date,
        description: data.description,
         city_id: data.city_id,
        whatsapp: data.whatsapp,
        telegram: data.telegram
    };

    if (allowedFields.name !== undefined && !allowedFields.name) {
        throw new Error('El nombre es obligatorio');
    }

    if (allowedFields.birth_date !== undefined && !allowedFields.birth_date) {
        throw new Error('La fecha de nacimiento es obligatoria');
    }

   if (allowedFields.city_id !== undefined && !allowedFields.city_id) {
    throw new Error('La ciudad es obligatoria');
    }

    if (allowedFields.city_id !== undefined) {

        const city = await db.City.findByPk(
            allowedFields.city_id
        );

        if (!city) {
            throw new Error('La ciudad seleccionada no existe');
        }
    }

    if (allowedFields.birth_date !== undefined) {

        const birthDate = new Date(allowedFields.birth_date);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDifference =
            today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 &&
                today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            throw new Error(
                'Debes ser mayor de 18 años'
            );
        }
    }

    return await this.profileRepository.update(
        profile.id,
        allowedFields
    );
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
            }
        );

        await transaction.commit();

        return updatedPhoto;

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
}
async registerView(profileId, visitorToken) {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
        throw new Error('Perfil no encontrado');
    }

    await this.profileRepository.createView(
        profileId,
        visitorToken
    );

    return await this.profileRepository.countViews(profileId);
}
}

module.exports = ProfileService;