require('dotenv').config();

const EmailService = require('./src/services/email.service');

async function testEmail() {
    const emailService = new EmailService();

    try {
        const result = await emailService.sendEmail(
            process.env.EMAIL_USER,
            'Prueba de correo - Fornicas',
            '¡Hola! Este es un correo de prueba enviado desde el backend de Fornicas. La configuración de Gmail funciona correctamente.'
        );

        console.log('Correo enviado correctamente.');
        console.log('Identificador:', result.messageId);
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
}

testEmail();