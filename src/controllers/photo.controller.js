const PhotoService = require('../services/photo.service');

class PhotoController {

    constructor() {
        this.photoService = new PhotoService();
    }

    create = async (req, res) => {
        try {

            const userId = req.user.id;

          const photo = await this.photoService.create(
            userId,
            req.file
        );

            return res.status(201).json({
                success: true,
                message: 'Foto registrada correctamente',
                data: photo
            });

        } catch (error) {

            console.error('Error al registrar foto:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    getByProfileId = async (req, res) => {
    try {

        const { profileId } = req.params;

        const photos = await this.photoService.getByProfileId(profileId);

        return res.status(200).json({
            success: true,
            data: photos
        });

    } catch (error) {

        console.error('Error al obtener fotos:', error);

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

        await this.photoService.delete(userId, id);

        return res.status(200).json({
            success: true,
            message: 'Foto eliminada correctamente'
        });

    } catch (error) {

        console.error('Error al eliminar foto:', error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
setMain = async (req, res) => {
    try {

        const userId = req.user.id;
        const { id } = req.params;

        const photo = await this.photoService.setMain(
            userId,
            id
        );

        return res.status(200).json({
            success: true,
            message: 'Foto principal actualizada correctamente',
            data: photo
        });

    } catch (error) {

        console.error('Error al establecer foto principal:', error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
}

module.exports = PhotoController;