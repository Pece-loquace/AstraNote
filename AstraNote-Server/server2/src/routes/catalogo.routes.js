const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/* -------------------Altri endpoint---------- */
/*Quando faccio il login nel mio sito devo vedere tutti i corsi che ho nella mia facoltà */
router.get("/api/corsi", async (req, res) => {
  const { facolta_id } = req.query;
  console.log("Facoltà in ingresso " + facolta_id)


  const { data, error } = await supabase
    .from("corsi")
    .select("*")
    .eq("facolta", facolta_id);

  console.log(data);
  console.log(error);
  if (error) {
    return res.status(500).json({ error: "Errore nei corsi" });
  }
  res.json(data);
});

/*Carica le faocltà nel momento della registrazione*/
router.get("/api/facolta/:idFacolta", async (req, res) => {
  const { data, error } = await supabase
    .from("facolta")
    .select("nome")
    .eq("id", req.params.idFacolta)
    .single();

  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }
  res.json(data);
});

/*Endpoint per restituire i corsi della facoltà nel momento del login */
router.get("/api/facolta/:id/corsi", async (req, res) => {
  const idFacoltà = req.params.id;

  const { data, error } = await supabase
    .from("corsi")
    .select("*")
    .eq("facoltà", idFacolta);

  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }
  res.json(data);
});

/*Carica le faocltà nel momento della registrazione*/
router.get("/api/facolta", async (req, res) => {
  const { data, error } = await supabase.from("facolta").select("id, nome");

  if (error) {
    return res.status(500).json({ error: "Errore nella query al database" });
  }
  console.log(error);
  res.json(data);
});

module.exports = router;
