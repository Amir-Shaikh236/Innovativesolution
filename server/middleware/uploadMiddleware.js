const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Allowed MIME types mapped to their correct values
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Allowed extensions as a secondary check
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i;

function checkFileType(file, cb) {
    const validMime = ALLOWED_MIME_TYPES.includes(file.mimetype);
    const validExt = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));

    if (validMime && validExt) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
