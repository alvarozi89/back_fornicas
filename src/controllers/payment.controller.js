const PaymentService = require('../services/payment.service');

class PaymentController {

    constructor() {
        this.paymentService = new PaymentService();
    }

    getMyPayments = async (req, res) => {
        try {

            const userId = req.user.id;

            const payments =
                await this.paymentService.getMyPayments(userId);

            return res.status(200).json({
                success: true,
                data: payments
            });

        } catch (error) {

            console.error(
                'Error al obtener pagos:',
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    getPendingPayments = async (req, res) => {
    try {

        const payments =
            await this.paymentService.getPendingPayments();

        return res.status(200).json({
            success: true,
            data: payments
        });

    } catch (error) {

        console.error(
            'Error al obtener pagos pendientes:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
createManualPayment = async (req, res) => {
    try {

        const userId = req.user.id;
        const { reference } = req.body;

        const payment =
            await this.paymentService.createManualPayment(
                userId,
                reference
            );

        return res.status(201).json({
            success: true,
            message: 'Pago registrado correctamente. Queda pendiente de aprobación.',
            data: payment
        });

    } catch (error) {

        console.error(
            'Error al registrar pago manual:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
approvePayment = async (req, res) => {
    try {

        const { id } = req.params;

        const result =
            await this.paymentService.approvePayment(id);

        return res.status(200).json({
            success: true,
            message: 'Pago aprobado y suscripción creada correctamente',
            data: result
        });

    } catch (error) {

        console.error(
            'Error al aprobar pago:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
rejectPayment = async (req, res) => {
    try {

        const { id } = req.params;

        const payment =
            await this.paymentService.rejectPayment(id);

        return res.status(200).json({
            success: true,
            message: 'Pago rechazado correctamente',
            data: payment
        });

    } catch (error) {

        console.error(
            'Error al rechazar pago:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
}

module.exports = PaymentController;