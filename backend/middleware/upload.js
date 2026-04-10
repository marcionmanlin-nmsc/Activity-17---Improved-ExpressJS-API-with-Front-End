const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const makeStorage = (dest) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const unique = crypto.randomBytes(16).toString('hex');
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
};

const uploadProduct = multer({
  storage: makeStorage(path.join(__dirname, '..', 'uploads', 'products')),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadProfile = multer({
  storage: makeStorage(path.join(__dirname, '..', 'uploads', 'profiles')),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = { uploadProduct, uploadProfile };
