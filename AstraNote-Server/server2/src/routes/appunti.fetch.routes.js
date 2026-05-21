const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

//-----Funzione per fetch_card---------
router.get("/api/appunti/:id/fetch_card", async (req, res) => {
  const appuntoId = req.params.id;

  const { data, error } = await supabase.rpc("get_card_appunto_dettagli", {
    p_appunto_id: appuntoId,
    p_utente_loggato_id: req.session.user.id,
  });
  console.log(data);
  console.log(error);
  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }

  res.json(data);
});

module.exports = router;
