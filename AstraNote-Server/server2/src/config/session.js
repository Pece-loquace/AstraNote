const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("./database");

/* Impostare sessioni */
const sessionMiddleware = session({
  store: new pgSession({
    pool: pgPool,
    tableName: "session",
    createTableIfMissing: false, //qui è importante specificare il nome giusto
  }),
  secret: "una_stringa_segreta_molto_lunga",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, //impostiamo la durata del cookie pari a 24 ore
    httpOnly: true, //per non far leggere il cookie nel client (sicurezza)
  },
});

module.exports = sessionMiddleware;
