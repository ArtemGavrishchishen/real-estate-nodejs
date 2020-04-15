const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'avatar') {
      return cb(null, 'images/avatar');
    }
    if (file.fieldname === 'property') {
      return cb(null, 'images/property');
    }
    cb(null, 'images');
  },
  filename(req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const alowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (alowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
