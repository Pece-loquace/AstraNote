const cors = require("cors");

/*Aggiungo il middleware Cors per far parlare frontend e backend*/
const corsMiddleware = cors({
  origin: "http://localhost:5173",
  credentials: true, // necessario per mandare i cookie di sessione
});

module.exports = corsMiddleware;
