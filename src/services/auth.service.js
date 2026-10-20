const db = require("../models");
const UserRepository = require("../repositories/user.repository");
const ProfileRepository = require("../repositories/profile.repository");
const SubscriptionRepository = require("../repositories/subscription.repository");
const EmailService = require('./email.service');
const bcrypt = require("bcrypt");
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');
const PasswordResetRepository = require('../repositories/passwordreset.repository');


class AuthService {
  constructor() {
    this.userRepository = new UserRepository(db);
    this.profileRepository = new ProfileRepository(db);
    this.subscriptionRepository = new SubscriptionRepository(db);
    this.emailService = new EmailService();
    this.passwordResetRepository = new PasswordResetRepository(db);

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

    console.log("👉 Intentando registrar con WhatsApp:", whatsapp); // 👈 Depuración 1

    // ==========================
    // VALIDACIONES DE NEGOCIO
    // ==========================

    if (!email) {
      throw new Error("El email es obligatorio");
    }

    const disposableDomains = require('disposable-email-domains');
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && disposableDomains.includes(emailDomain)) {
      throw new Error("No se permiten correos temporales o desechables. Por favor usa un correo válido.");
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
    
    const birthDate = new Date(`${birth_date}T00:00:00`);

    if (Number.isNaN(birthDate.getTime())) {
      throw new Error("La fecha de nacimiento no es válida");
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
          monthDifference === 0 &&
          today.getDate() < birthDate.getDate()
      )
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
      
      await transaction.commit();

      return {
        user: { id: user.id, email: user.email, role: user.role },
        profile: { id: profile.id, name: profile.name, city_id: profile.city_id, title: profile.title },
        subscription: { id: subscription.id, type: subscription.type, status: subscription.status, start_date: subscription.start_date, end_date: subscription.end_date },
      };

    } catch (error) {
      await transaction.rollback();

      console.error("🚨 ERROR CAPTURADO EN CATCH:", error.name); // 👈 Depuración 2
      console.error("🚨 DETALLE COMPLETO DEL ERROR:", error); // 👈 Depuración 3

      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors?.[0]?.path;
        console.log("🎯 El campo duplicado que falló es:", field); // 👈 Depuración 4

        if (field === 'whatsapp') {
          throw new Error('Este número de WhatsApp ya se encuentra asociado a otro perfil.');
        }
        if (field === 'email') {
          throw new Error('Este correo electrónico ya está registrado.');
        }
      }

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

    // 1. Validamos la contraseña primero por seguridad
    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        throw new Error('Credenciales inválidas');
    }

    // 2. Si la contraseña es correcta pero está inactivo, ¡lo reactivamos automáticamente!
    if (user.status !== 'ACTIVE') {
        const t = await db.sequelize.transaction();
        try {
            await db.User.update(
                { status: 'ACTIVE' },
                { where: { id: user.id }, transaction: t }
            );

            await db.Profile.update(
                { status: 'ACTIVE' },
                { where: { user_id: user.id }, transaction: t }
            );

            await t.commit();
            user.status = 'ACTIVE'; // Actualizamos la variable local en memoria
        } catch (error) {
            await t.rollback();
            throw new Error('Error al reactivar la cuenta automáticamente');
        }
    }

    // 3. Generamos el token de acceso normal
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
async requestPasswordReset(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('El email es obligatorio');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await this.userRepository.findByEmail(normalizedEmail);

  // No revelar si el correo está registrado.
  if (!user || user.status !== 'ACTIVE') {
    return {
      message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.'
    };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const transaction = await db.sequelize.transaction();

  try {
    await this.passwordResetRepository.invalidatePendingByUserId(
      user.id,
      transaction
    );

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used_at: null
    }, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error('Falta configurar FRONTEND_URL');
  }

  const resetUrl =
    `${frontendUrl.replace(/\/$/, '')}/auth/reset-password?token=${rawToken}`;

  await this.emailService.sendEmail(
    user.email,
    'Recuperación de contraseña - Fornicas',
    `Hola,

Recibimos una solicitud para recuperar tu contraseña de Fornicas.

Abre el siguiente enlace para establecer una nueva contraseña:
${resetUrl}

Este enlace vence en 15 minutos y solo puede utilizarse una vez.

Si no solicitaste este cambio, puedes ignorar este correo.`
  );

  return {
    message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.'
  };
}

async resetPassword(token, newPassword) {
  if (!token || typeof token !== 'string') {
    throw new Error('El token de recuperación es obligatorio');
  }

  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('La nueva contraseña es obligatoria');
  }

  if (newPassword.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const resetRequest =
    await this.passwordResetRepository.findValidByTokenHash(tokenHash);

  if (!resetRequest || new Date(resetRequest.expires_at) <= new Date()) {
    throw new Error('El enlace de recuperación no es válido o ha vencido');
  }

  const transaction = await db.sequelize.transaction();

  try {
    // Volver a comprobar el token dentro de la transacción evita
    // reutilizarlo si otra solicitud ya lo consumió.
    const lockedRequest = await db.PasswordReset.findOne({
      where: {
        id: resetRequest.id,
        token_hash: tokenHash,
        used_at: null
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!lockedRequest || new Date(lockedRequest.expires_at) <= new Date()) {
      throw new Error('El enlace de recuperación no es válido o ha vencido');
    }

    const user = await this.userRepository.findById(
      lockedRequest.user_id
    );

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('No se pudo restablecer la contraseña');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

   await this.userRepository.update(
    user.id,
    { password_hash: passwordHash },
    transaction
  );

    await this.passwordResetRepository.markAsUsed(
      lockedRequest.id,
      transaction
    );

    await transaction.commit();

    return {
      message: 'La contraseña se actualizó correctamente'
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
}

module.exports = AuthService;
