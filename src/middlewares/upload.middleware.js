const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/photos');
    },

    filename: (req, file, cb) => {

        const extension = path
    .extname(file.originalname)
    .toLowerCase();

        const filename =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    const allowedExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp'
    ];

    const extension = path.extname(
        file.originalname
    ).toLowerCase();

    if (
        allowedTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension)
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                'Solo se permiten imágenes JPG, JPEG, PNG o WEBP'
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;