const AuthService = require('../services/auth.service');

class AuthController {

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {

            const result = await this.authService.register(req.body);

            return res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente',
                data: result
            });

        } catch (error) {

            console.error('Error en registro:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await this.authService.login(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: result
        });

    } catch (error) {

        console.error('Error en login:', error);

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};
requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await this.authService.requestPasswordReset(email);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error solicitando recuperación de contraseña:', error);

        return res.status(500).json({
            success: false,
            message: 'No fue posible procesar la solicitud. Inténtalo más tarde.'
        });
    }
};

resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const result = await this.authService.resetPassword(
            token,
            newPassword
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error restableciendo contraseña:', error);

        const clientErrors = [
            'El token de recuperación es obligatorio',
            'La nueva contraseña es obligatoria',
            'La contraseña debe tener al menos 8 caracteres',
            'El enlace de recuperación no es válido o ha vencido',
            'No se pudo restablecer la contraseña'
        ];

        const status = clientErrors.includes(error.message) ? 400 : 500;

        return res.status(status).json({
            success: false,
            message: status === 400
                ? error.message
                : 'No fue posible restablecer la contraseña. Inténtalo más tarde.'
        });
    }
};
}

module.exports = AuthController;