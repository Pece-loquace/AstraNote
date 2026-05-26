const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");

//----------Utente -----------
router.get("/api/utenti/:id", async (req, res) => {
  const id_utente = req.params.id;

  const { data, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("id", id_utente)
    .single();

  console.log(data)
  console.log(error)
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


router.put("/api/utenti/:id", async (req, res) => {
  console.log(req.body)
  const { nome, facolta, passwordAttuale, nuovaPassword } = req.body;
  const idUtente = req.params.id;

  const { data, error } = await supabase
    .from("utenti")
    .select("password_hash")
    .eq("id", idUtente)
    .single()

  if (error) {
    return res.status(500).json({ error: "Errore nel recuperare la password" });
  }


  const isPasswordCorrect = await bcrypt.compare(passwordAttuale, data.password_hash);
  console.log()
  if (isPasswordCorrect) {
    if (nuovaPassword) {
      const saltRounds = 10;
      const hashNuovaPassword = await bcrypt.hash(nuovaPassword, saltRounds);
      const { error } = await supabase
        .from("utenti")
        .update({
          nome: nome,
          facolta: facolta,
          password_hash: hashNuovaPassword
        })
        .eq("id", idUtente)

      if (error) {
        return res.status(500).json({ error: "Errore nell'aggiornare i 3 campi" });
      }
    } else {
      //Se non è stata settata la nuova password aggiorno solo i campi restanti
      const { error } = await supabase
        .from("utenti")
        .update({
          nome: nome,
          facolta: facolta,
        })
        .eq("id", idUtente)

      console.log(error)
      if (error) {
        return res.status(500).json({ error: "Errore nell'aggiornare i 2 campi" });
      }
    }
  } else {
    return res.status(401).json({ error: "Password non corretta" });
  }
  return res.json({ message: "Profilo aggiornato" });
})
module.exports = router;
