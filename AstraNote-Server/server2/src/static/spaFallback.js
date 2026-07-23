const path = require("path");
const { ROOT } = require("../config/env"); // stesso ROOT di server/index.js (dist/)

const spaFallback = (req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
};

module.exports = spaFallback;
