const nodemailer = require('nodemailer');

class EmailService {

     constructor() {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        family: 4,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    }

    async sendEmail(to, subject, text) {
        if (!to) {
            throw new Error('El destinatario del correo es obligatorio');
        }

        if (!subject || !text) {
            throw new Error('El asunto y el contenido son obligatorios');
        }

        return await this.transporter.sendMail({
            from: `"${process.env.EMAIL_FROM || 'Fornicas'}" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
    }

    async verifyConnection() {
        return await this.transporter.verify();
    }
}

module.exports = EmailService;
