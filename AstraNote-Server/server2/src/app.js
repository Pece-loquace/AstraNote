//Importiamo express
const express = require("express");
const app = express();

require("./config/env");

const corsMiddleware = require("./config/cors");
const { ROOT } = require("./config/env");
const sessionMiddleware = require("./config/session");
const registerRoutes = require("./routes");
const spaFallback = require("./static/spaFallback");

app.use(corsMiddleware);

app.use(express.static(ROOT));

app.use(express.json());

app.use(sessionMiddleware);

registerRoutes(app);

app.use(spaFallback);

module.exports = app;
