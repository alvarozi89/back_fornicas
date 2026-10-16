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
updatePassword = async (req, res) => {
        try {
            const userId = req.user.id; // Extraído del token JWT de la usuaria autenticada
            const { currentPassword, newPassword } = req.body;

            await this.profileService.updatePassword(
                userId,
                currentPassword,
                newPassword
            );

            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizada correctamente'
            });

        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);

            const badRequestErrors = [
                'Usuario no encontrado',
                'La contraseña actual es incorrecta',
                'La nueva contraseña debe tener al menos 8 caracteres'
            ];

            const statusCode = badRequestErrors.includes(error.message) ? 400 : 500;

            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Error interno al actualizar la contraseña'
            });
        }
    };
}

module.exports = ProfileController;