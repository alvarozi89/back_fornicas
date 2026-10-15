
const { Resend } = require('resend');
class EmailService {
    constructor() {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('Falta configurar RESEND_API_KEY');
        }

        this.resend = new Resend(process.env.RESEND_API_KEY);

    }

    async sendEmail(to, subject, text) {
        if (!to) {
            throw new Error('El destinatario del correo es obligatorio');
        }

        if (!subject || !text) {
            throw new Error('El asunto y el contenido son obligatorios');
        }

        const { data, error } = await this.resend.emails.send({
           from: 'Fornicas <notificaciones@fornicas.com>',
            to,
            subject,
            text
        });

        if (error) {
            throw new Error(`Error enviando correo con Resend: ${error.message}`);
        }

        return data;
    }

    async verifyConnection() {
        return Boolean(process.env.RESEND_API_KEY);
    }
}

module.exports = EmailService;
