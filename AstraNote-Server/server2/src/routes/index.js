const appuntiRoutes = require("./appunti.routes");
const segnalazioniRoutes = require("./segnalazioni.routes");
const recensioniRoutes = require("./recensioni.routes");
const catalogoRoutes = require("./catalogo.routes");
const preferitiRoutes = require("./preferiti.routes");
const utentiRoutes = require("./utenti.routes");
const authRoutes = require("./auth.routes");

// Stesso ordine di registrazione di server/index.js
function registerRoutes(app) {
  app.use(appuntiRoutes);
  app.use(segnalazioniRoutes);
  app.use(recensioniRoutes);
  app.use(catalogoRoutes);
  app.use(preferitiRoutes);
  app.use(utentiRoutes);
  app.use(authRoutes);
}

module.exports = registerRoutes;
