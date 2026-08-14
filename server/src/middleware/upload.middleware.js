const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
    fields: 20,
    parts: 30,
    fieldNameSize: 100,
    fieldSize: 100 * 1024,
    fieldNestingDepth: 5,
  },

  fileFilter,
});

module.exports = upload;
