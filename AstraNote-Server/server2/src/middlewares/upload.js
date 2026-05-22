const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });
const uploadAppunto = multer({ storage }).fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

module.exports = upload;
module.exports.uploadAppunto = uploadAppunto;
