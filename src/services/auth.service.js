const db = require("../models");
const UserRepository = require("../repositories/user.repository");
const ProfileRepository = require("../repositories/profile.repository");
const SubscriptionRepository = require("../repositories/subscription.repository");
const bcrypt = require("bcrypt");
const { generateToken } = require('../utils/jwt');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository(db);
    this.profileRepository = new ProfileRepository(db);
    this.subscriptionRepository = new SubscriptionRepository(db);
  }

  async register(data) {
    const {
      email,
      password,
      name,
      nickname,
      title,
      birth_date,
      description,
      city_id,
      whatsapp,
      telegram,
    } = data;

    // ==========================
    // VALIDACIONES DE NEGOCIO
    // ==========================

    if (!email) {
      throw new Error("El email es obligatorio");
    }

    if (!password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (!name) {
      throw new Error("El nombre es obligatorio");
    }

    if (!birth_date) {
      throw new Error("La fecha de nacimiento es obligatoria");
    }

    if (!city_id) {
    throw new Error("La ciudad es obligatoria");
  }

    const city = await db.City.findByPk(city_id);

    if (!city) {
      throw new Error("La ciudad seleccionada no existe");
    }
    const birthDate = new Date(birth_date);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
    age--;
    }

    if (age < 18) {
    throw new Error("Debes ser mayor de 18 años para registrarte");
    }

    const userExists = await this.userRepository.existsByEmail(email);

    if (userExists) {
      throw new Error("El email ya está registrado");
    }

    // ==========================
    // TRANSACCIÓN
    // ==========================

    const transaction = await db.sequelize.transaction();

    try {
      // ==========================
      // CREAR USER
      // ==========================

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await this.userRepository.create(
        {
          email,
          password_hash: passwordHash,
          role: "WOMAN",
          status: "ACTIVE",
        },
        transaction,
      );

      // ==========================
      // CREAR PROFILE
      // ==========================

      const profile = await this.profileRepository.create(
        {
          user_id: user.id,
          name,
          nickname,
          title,
          birth_date,
          description,
          city_id,
          whatsapp,
          telegram,
          status: "ACTIVE",
        },
        transaction,
      );

      // ==========================
      // CREAR FREE TRIAL
      // ==========================

      const startDate = new Date();

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const subscription = await this.subscriptionRepository.create(
        {
          profile_id: profile.id,
          type: "FREE_TRIAL",
          status: "ACTIVE",
          start_date: startDate,
          end_date: endDate,
          amount: 0,
        },
        transaction,
      );

      // ==========================
      // CONFIRMAR
      // ==========================

      await transaction.commit();

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },

        profile: {
          id: profile.id,
          name: profile.name,
          city_id: profile.city_id,
          title: profile.title,
        },

        subscription: {
          id: subscription.id,
          type: subscription.type,
          status: subscription.status,
          start_date: subscription.start_date,
          end_date: subscription.end_date,
        },
      };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async login(email, password) {

    if (!email) {
        throw new Error('El email es obligatorio');
    }

    if (!password) {
        throw new Error('La contraseña es obligatoria');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('El usuario no está activo');
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        throw new Error('Credenciales inválidas');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
  });

  return {
      user: {
          id: user.id,
          email: user.email,
          role: user.role
      },
      token
  };
}
}

module.exports = AuthService;
