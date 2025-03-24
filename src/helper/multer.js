import multer from 'multer'
import AppError from '../utils/appError.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp/');
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" ||
            file.mimetype == "image/svg" || file.mimetype == "image/avif" ||
            file.mimetype == "image/webp" || file.mimetype == "image/bmp" ||
            file.mimetype == "image/ico" || file.mimetype == "image/gif"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(
                new AppError(
                    400,
                    'fail',
                    'Invalid upload: fieldname should be image and format should be image format!'
                )
            );
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }
})

export default upload