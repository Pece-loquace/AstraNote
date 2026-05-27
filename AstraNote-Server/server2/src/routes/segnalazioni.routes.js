const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/*********************CRUD Segnalazioni ************/
router.post("/api/segnalazioni", async (req, res) => {
  const { messaggio, appuntoId } = req.body;
  const data_creazione = new Date().toISOString();
  console.log("Body ricevuto:", req.body);
  console.log("AppuntId , messaggio", appuntoId, req.body.messaggio);

  const { data, error } = await supabase
    .from("segnalazioni")
    .insert([
      {
        utente_segnalante: req.session.user.id,
        messaggio: messaggio,
        created_at: data_creazione,
        appunto_id: appuntoId,
      },
    ])
    .select();
  console.log(data);
  console.log(error);
  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nella creazione della segnalazione" });
  }

  res.status(201).json({
    message: "Segnalazione aggiunta con successo!",
    recensione: data[0],
  });
});


router.get("/api/segnalazioni_utente", async (req, res) => {
  const idSegnalazione = req.params.id;

  const { data, error } = await supabase
    .from("segnalazioni")
    .select("*")
    .eq("utente_segnalante", req.session.user.id);

  if (error) {
    return res.status(500).json({ error: "Errore nel" });
  }

  res.json(data);
});



module.exports = router;
