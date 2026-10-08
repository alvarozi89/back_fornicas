const db = require("../models");
const PaymentRepository = require("../repositories/payment.repository");
const ProfileRepository = require("../repositories/profile.repository");
const SubscriptionRepository = require("../repositories/subscription.repository");

class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository(db);
    this.profileRepository = new ProfileRepository(db);
    this.subscriptionRepository = new SubscriptionRepository(db);
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

      const payment = await this.paymentRepository.create(
        {
          profile_id: profile.id,
          subscription_id: subscription.id,
          amount,
          payment_date: new Date(),
          payment_method: paymentData.payment_method || "MANUAL",
          reference: paymentData.reference || null,
          status: "APPROVED",
        },
        transaction,
      );

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

    const pendingPayment = await this.paymentRepository.findPendingByProfileId(
      profile.id,
    );

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

    return payment;
  }
  async rejectPayment(paymentId) {
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

      const rejectedPayment = await this.paymentRepository.reject(
        payment.id,
        transaction,
      );

      await transaction.commit();

      return rejectedPayment;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}

module.exports = PaymentService;
