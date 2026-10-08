const adminMiddleware = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado'
        });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Acceso restringido a administradores'
        });
    }

    next();
};

module.exports = adminMiddleware;