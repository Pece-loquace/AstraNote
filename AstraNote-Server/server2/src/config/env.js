const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

//Carica le variabili dal file .env
require("dotenv").config({ path: path.join(PROJECT_ROOT, ".env") });

const ROOT = path.join(PROJECT_ROOT, "dist");
const PORT = 3000;
const HOST = "0.0.0.0";

module.exports = { ROOT, PORT, HOST };
