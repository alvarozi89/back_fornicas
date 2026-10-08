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
}

module.exports = AuthController;