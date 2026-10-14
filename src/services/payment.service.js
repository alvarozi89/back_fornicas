const db = require("../models");
const PaymentRepository = require("../repositories/payment.repository");
const ProfileRepository = require("../repositories/profile.repository");
const SubscriptionRepository = require("../repositories/subscription.repository");
const EmailService = require("./email.service");
const NotificationService = require("./notification.service");

class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository(db);
    this.profileRepository = new ProfileRepository(db);
    this.subscriptionRepository = new SubscriptionRepository(db);
    this.emailService = new EmailService();
    this.notificationService = new NotificationService();
  }

  async getMyPayments(userId) {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new Error("Perfil no encontrado");
    }

    return await this.paymentRepository.findByProfileId(profile.id);
  }

  async getPendingPayments() {
    return await this.paymentRepository.findPending();
  }

  async createPaidSubscription(userId, paymentData) {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new Error("Perfil no encontrado");
    }

    const amount = 30000;

    if (Number(paymentData.amount) !== amount) {
      throw new Error("El valor del pago no es válido");
    }

    const transaction = await db.sequelize.transaction();

    try {
      const startDate = new Date();

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const subscription = await this.subscriptionRepository.create(
        {
          profile_id: profile.id,
          type: "PAID",
          status: "ACTIVE",
          start_date: startDate,
          end_date: endDate,
          amount,
        },
        transaction,
      );

     
const payment = await this.paymentRepository.create({
  profile_id: profile.id,
  subscription_id: null,
  amount: 30000,
  payment_date: new Date(),
  payment_method: "MANUAL",
  reference,
  status: "PENDING",
});

// Notificación interna
try {
  await this.notificationService.createNotification(
    profile.id,
    "PAYMENT",
    "Pago recibido",
    "Tu comprobante de pago fue recibido y está pendiente de revisión."
  );
} catch (error) {
  console.error("Error creando notificación de pago:", error.message);
}

// Correo de confirmación
try {
console.log("DIAGNOSTICO: entrando al envío de correo del pago");
  const profileWithUser = await this.profileRepository.findById(profile.id);
  console.log("Perfil encontrado:", !!profileWithUser);
console.log("Usuario relacionado:", !!profileWithUser?.user);
console.log("Correo encontrado:", profileWithUser?.user?.email);

  if (profileWithUser?.user?.email) {
    await this.emailService.sendEmail(
      profileWithUser.user.email,
      "Comprobante recibido - Fornicas",
      `Hola ${profile.name},

Hemos recibido tu comprobante de pago por $30.000 COP.

Tu pago está pendiente de revisión por el administrador. Te notificaremos cuando sea aprobado o rechazado.

Gracias por utilizar Fornicas.`
    );
  }
} catch (error) {
  console.error("Error enviando correo de pago:", error.message);
}

return payment;

      await transaction.commit();

      return {
        subscription,
        payment,
      };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async approvePayment(paymentId) {
    if (!paymentId) {
      throw new Error("El ID del pago es obligatorio");
    }

    const transaction = await db.sequelize.transaction();

    try {
      const payment = await this.paymentRepository.findById(
        paymentId,
        transaction,
      );

      if (!payment) {
        throw new Error("Pago no encontrado");
      }

      if (payment.status !== "PENDING") {
        throw new Error("El pago no está pendiente de aprobación");
      }

      if (payment.payment_method !== "MANUAL") {
        throw new Error("El método de pago no es válido para este proceso");
      }

      if (Number(payment.amount) !== 30000) {
        throw new Error("El valor del pago no es válido");
      }

      const latestSubscription =
        await this.subscriptionRepository.findLatestByProfileId(
          payment.profile_id,
          transaction,
        );

      const now = new Date();

      let startDate = now;

      if (latestSubscription && new Date(latestSubscription.end_date) > now) {
        startDate = new Date(latestSubscription.end_date);
      }

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const subscription = await this.subscriptionRepository.create(
        {
          profile_id: payment.profile_id,
          type: "PAID",
          status: startDate > now ? "PENDING" : "ACTIVE",
          start_date: startDate,
          end_date: endDate,
          amount: 30000,
        },
        transaction,
      );

      const approvedPayment = await this.paymentRepository.approve(
        payment.id,
        subscription.id,
        transaction,
      );

     
await transaction.commit();

// Notificar aprobación del pago
try {
  await this.notificationService.createNotification(
    payment.profile_id,
    "PAYMENT",
    "Pago aprobado",
    "Tu pago fue aprobado y tu suscripción ha sido programada."
  );
} catch (error) {
  console.error(
    "Error creando notificación de aprobación:",
    error.message
  );
}

  // Enviar correo de aprobación
  try {
    const profile = await this.profileRepository.findById(payment.profile_id);

    if (profile?.user?.email) {
      await this.emailService.sendEmail(
        profile.user.email,
        "Pago aprobado - Fornicas",
        `Hola ${profile.name},

  Tu pago de $30.000 COP ha sido aprobado.

  Tu suscripción ha sido registrada correctamente. Puedes ingresar a Fornicas para consultar su estado y vigencia.

  Gracias por formar parte de Fornicas.`
      );
    }
  } catch (error) {
    console.error(
      "Error enviando correo de aprobación:",
      error.message
    );
  }

  return {
    payment: approvedPayment,
    subscription,
};
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
 
async createManualPayment(userId, reference) {
  if (!reference) {
    throw new Error("La referencia del pago es obligatoria");
  }

  const profile = await this.profileRepository.findByUserId(userId);

  if (!profile) {
    throw new Error("Perfil no encontrado");
  }

  const pendingPayment =
    await this.paymentRepository.findPendingByProfileId(profile.id);

  if (pendingPayment) {
    throw new Error("Ya tienes un pago pendiente de aprobación");
  }

  const existingPayment =
    await this.paymentRepository.findByReference(reference);

  if (existingPayment) {
    throw new Error("La referencia del pago ya fue registrada");
  }

  const payment = await this.paymentRepository.create({
    profile_id: profile.id,
    subscription_id: null,
    amount: 30000,
    payment_date: new Date(),
    payment_method: "MANUAL",
    reference,
    status: "PENDING",
  });

  // Crear notificación interna
  try {
    await this.notificationService.createNotification(
      profile.id,
      "PAYMENT",
      "Pago recibido",
      "Tu comprobante de pago fue recibido y está pendiente de revisión."
    );
  } catch (error) {
    console.error(
      "Error creando notificación de pago:",
      error.message
    );
  }

  // Enviar correo de confirmación
  try {
    const profileWithUser =
      await this.profileRepository.findById(profile.id);

    if (profileWithUser?.user?.email) {
      await this.emailService.sendEmail(
        profileWithUser.user.email,
        "Comprobante recibido - Fornicas",
        `Hola ${profile.name},

Hemos recibido tu comprobante de pago por $30.000 COP.

Tu pago está pendiente de revisión por el administrador. Te notificaremos cuando sea aprobado o rechazado.

Gracias por utilizar Fornicas.`
      );

      console.log("Correo de confirmación de pago enviado.");
    } else {
      console.error(
        "No se encontró el correo de la usuaria para el pago."
      );
    }
  } catch (error) {
    console.error(
      "Error enviando correo de pago:",
      error.message
    );
  }

  return payment;
}
 
async rejectPayment(paymentId) {
  if (!paymentId) {
    throw new Error("El ID del pago es obligatorio");
  }

  const transaction = await db.sequelize.transaction();
  let rejectedPayment;

  try {
    const payment = await this.paymentRepository.findById(
      paymentId,
      transaction
    );

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    if (payment.status !== "PENDING") {
      throw new Error("El pago no está pendiente de aprobación");
    }

    rejectedPayment = await this.paymentRepository.reject(
      payment.id,
      transaction
    );

    await transaction.commit();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }

  // Notificación interna
  try {
    await this.notificationService.createNotification(
      rejectedPayment.profile_id,
      "PAYMENT",
      "Pago rechazado",
      "Tu comprobante de pago fue rechazado. Revisa la información y contacta al administrador si necesitas ayuda."
    );
  } catch (error) {
    console.error(
      "Error creando notificación de rechazo:",
      error.message
    );
  }

  // Correo de rechazo
  try {
    const profile = await this.profileRepository.findById(
      rejectedPayment.profile_id
    );

    if (profile?.user?.email) {
      await this.emailService.sendEmail(
        profile.user.email,
        "Pago rechazado - Fornicas",
        `Hola ${profile.name},

Tu comprobante de pago por $30.000 COP ha sido rechazado.

Por favor, revisa la información del pago y contacta al administrador de Fornicas si necesitas ayuda.

Gracias por tu comprensión.`
      );

      console.log("Correo de rechazo enviado.");
    } else {
      console.error(
        "No se encontró el correo de la usuaria para el pago rechazado."
      );
    }
  } catch (error) {
    console.error(
      "Error enviando correo de rechazo:",
      error.message
    );
  }

  return rejectedPayment;
}
}

module.exports = PaymentService;
