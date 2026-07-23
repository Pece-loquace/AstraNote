const { Pool } = require("pg");

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // NECESSARIO per connettersi a Supabase da locale
});

// AGGIUNGI QUESTO LOG:
console.log(
  "Tentativo di connessione al DB con stringa:",
  process.env.DATABASE_URL ? "Caricata correttamente" : "NON TROVATA!"
);

module.exports = pgPool;
