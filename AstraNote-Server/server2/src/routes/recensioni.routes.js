const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/*********************CRUD Recesioni************/
router.post("/api/recensioni", async (req, res) => {
  const { appunto_id, stelle } = req.body;

  const { data, error } = await supabase
    .from("recensioni")
    .insert([
      {
        appunto_id: appunto_id,
        utente_valutante: req.session.user.id,
        valutazione: stelle,
      },
    ])
    .select();
  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nella creazione della recensione" });
  }

  res.status(201).json({
    message: "Recensione aggiunta con successo!",
    recensione: data[0],
  });
});

router.get("/api/recensioni", async (req, res) => {
  const { data, error } = await supabase.from("recensioni").select("*");

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore durante la richiesta delle recensioni" });
  }

  res.json(data);
});

router.get("/api/recensioni/:id", async (req, res) => {
  const appuntoId = req.params.id;

  const { data, error } = await supabase
    .from("recensioni")
    .select("*")
    .eq("appunto_id", appuntoId);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nell'ottenere la recensioni" });
  }
  res.json(data);
});

router.put("/api/recensioni", async (req, res) => {
  const { stelle, appunto_id } = req.body;

  const { data, error } = await supabase
    .from("recensioni")
    .update({ valutazione: stelle })
    .eq("appunto_id", appunto_id)
    .eq("utente_valutante", req.session.user.id)
    .select();

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nell'ottenere la recension" });
  }
  res.json(data);
});

router.delete("/api/recensioni/:id", async (req, res) => {
  const recensioneId = req.params.id;

  const { error } = await supabase
    .from("recensioni")
    .delete()
    .eq("id", recensioneId);

  if (error) {
    res.status(500).json({ error: "Errore nella delete della recensione" });
  }
});

module.exports = router;
