const db = require('../models');
const UserRepository = require('../repositories/user.repository');

class UserService {

    constructor() {
        this.userRepository = new UserRepository(db);
    }

    async getById(id) {
        return await this.userRepository.findById(id);
    }

    async getByEmail(email) {
        return await this.userRepository.findByEmail(email);
    }

    async create(data) {
        const { email, password_hash, role } = data;

        if (!email) {
            throw new Error('El email es obligatorio');
        }

        if (!password_hash) {
            throw new Error('La contraseña es obligatoria');
        }

        const userExists = await this.userRepository.existsByEmail(email);

        if (userExists) {
            throw new Error('El email ya está registrado');
        }

        return await this.userRepository.create({
            email,
            password_hash,
            role: role || 'WOMAN'
        });
    }
}

module.exports = UserService;