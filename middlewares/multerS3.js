const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const path = require('path');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const folder = req.body.folder || 'chat_uploads';
      const filename = `${folder}/${Date.now()}_${path.basename(file.originalname)}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

module.exports = upload;