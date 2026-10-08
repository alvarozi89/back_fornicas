const db = require('../models');
const VideoRepository = require('../repositories/video.repository');
const ProfileRepository = require('../repositories/profile.repository');

class VideoService {

    constructor() {
        this.videoRepository = new VideoRepository(db);
        this.profileRepository = new ProfileRepository(db);
    }

    async create(userId, data) {

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        if (!data.url) {
            throw new Error('La URL del video es obligatoria');
        }

        const videos = await this.videoRepository.findByProfileId(
            profile.id
        );

        const sortOrder = videos.length;

        const video = await this.videoRepository.create({
            profile_id: profile.id,
            url: data.url,
            thumbnail_url: data.thumbnail_url || null,
            sort_order: sortOrder
        });

        return video;
    }

    async getByProfileId(profileId) {

        const profile = await this.profileRepository.findById(profileId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        return await this.videoRepository.findByProfileId(profileId);
    }

    async delete(userId, videoId) {

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('Perfil no encontrado');
        }

        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new Error('Video no encontrado');
        }

        if (video.profile_id !== profile.id) {
            throw new Error('No tienes permiso para eliminar este video');
        }

        await this.videoRepository.delete(videoId);

        return video;
    }
}

module.exports = VideoService;