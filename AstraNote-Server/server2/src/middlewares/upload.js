const multer = require("multer");

//Uso multer
const upload = multer({ storage: multer.memoryStorage() }); // Carica il file temporaneamente in RAM

module.exports = upload;
