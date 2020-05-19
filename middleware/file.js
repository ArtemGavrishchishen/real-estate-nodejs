const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'avatar') {
      return cb(null, 'images/avatar');
    }
    if (file.fieldname === 'property') {
      if (!req.user) {
        return cb(null, 'images/property');
      }

      const { _id } = req.user;
      const path = `images/property/${_id}`;

      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          return fs.mkdir(path, (err) => {
            if (err) throw err;
            cb(null, path);
          });
        }
        return cb(null, path);
      });
    }
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
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
