require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
const db = require('./models');
const startSubscriptionJob = require('./jobs/subscription.job');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Models cargados:', Object.keys(db));

        console.log('Conexión a MySQL establecida correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
        startSubscriptionJob();
    } catch (error) {
        console.error('Error al conectar con MySQL:', error);
    }
};

startServer();