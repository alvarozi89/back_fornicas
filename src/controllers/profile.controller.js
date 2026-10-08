const ProfileService = require('../services/profile.service');
const { generateVisitorToken } = require('../utils/visitor-token');
class ProfileController {

    constructor() {
        this.profileService = new ProfileService();
    }
getById = async (req, res) => {
    try {
        const { id } = req.params;

        let visitorToken = req.headers['x-visitor-token'];

        if (!visitorToken) {
            visitorToken = generateVisitorToken();
        }

        const profile = await this.profileService.getById(
            id,
            visitorToken
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Perfil no encontrado'
            });
        }

        res.setHeader('x-visitor-token', visitorToken);

        return res.status(200).json({
            success: true,
            data: profile
        });

    }  catch (error) {
    

    if (error.message === 'Perfil no encontrado') {
        return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
}
};

  getAllActive = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 12,
            name,
            title,
            departmentId,
            cityId
        } = req.query;

        const profiles = await this.profileService.getAllActive(
            page,
            limit,
            {
                name,
                title,
                departmentId,
                cityId
            }
        );

        return res.status(200).json({
            success: true,
            data: profiles
        });

    } catch (error) {

        console.error('Error al obtener perfiles:', error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

    getMyProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const profile = await this.profileService.getMyProfile(userId);

        return res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {

        console.error('Error al obtener mi perfil:', error);

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
updateMyProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const profile = await this.profileService.updateMyProfile(
            userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: profile
        });

    } catch (error) {

        console.error('Error al actualizar mi perfil:', error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
}

module.exports = ProfileController;