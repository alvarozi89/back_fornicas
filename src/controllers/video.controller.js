const VideoService = require('../services/video.service');

class VideoController {

    constructor() {
        this.videoService = new VideoService();
    }

    create = async (req, res) => {
        try {

            const userId = req.user.id;

            const video = await this.videoService.create(
                userId,
                req.body
            );

            return res.status(201).json({
                success: true,
                message: 'Video registrado correctamente',
                data: video
            });

        } catch (error) {

            console.error('Error al registrar video:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    getByProfileId = async (req, res) => {
        try {

            const { profileId } = req.params;

            const videos = await this.videoService.getByProfileId(
                profileId
            );

            return res.status(200).json({
                success: true,
                data: videos
            });

        } catch (error) {

            console.error('Error al obtener videos:', error);

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    };

    delete = async (req, res) => {
        try {

            const userId = req.user.id;
            const { id } = req.params;

            await this.videoService.delete(
                userId,
                id
            );

            return res.status(200).json({
                success: true,
                message: 'Video eliminado correctamente'
            });

        } catch (error) {

            console.error('Error al eliminar video:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = VideoController;