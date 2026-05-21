const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

//----------Utente -----------
router.get("/api/utenti/:id", async (req, res) => {
  const id_utente = req.params.id;

  const { data, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("id", id_utente)
    .single();

  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }

  res.json(data);
});

router.get("/api/user_ratings/:idUtente", async (req, res) => {
  const { data, error } = await supabase
    .from("user_ratings")
    .select("*")
    .eq("id", req.params.idUtente)
    .single();

  if (error) {
    return res.status(500).json({ error: "Errore query user_ratings" });
  }

  res.json(data);
});

//Restituisce l'entry utente_loggato
router.get("/api/utente_loggato", async (req, res) => {
  const { data, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("id", req.session.user.id)
    .single();

  console.log(data);
  console.log(error);

  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }

  res.json(data);
});

module.exports = router;
