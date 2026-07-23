const app = require("./app");
const { PORT, HOST } = require("./config/env");

//Impostiamo la porta, (ecco perche mi ero collegato a localhost:3000)

//AVVIO
app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error(`Errore avvio server sulla porta ${PORT}:`, err.message);
    if (err.code === "EADDRINUSE") {
      console.error(
        `La porta ${PORT} è già occupata. Chiudi l'altro processo Node (altro terminale npm run dev) e riprova.`
      );
    }
    process.exit(1);
    return;
  }
  console.log(`server in esecuzione su http://localhost:${PORT}`);
});
