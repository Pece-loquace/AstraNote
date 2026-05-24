const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/*-----CRUD preferiti-----*/
/*Crea una riga nella tabella preferiti */
router.post("/api/preferiti", async (req, res) => {
  const { appunto_id: appuntoId } = req.body;

  const { data, error } = await supabase
    .from("preferiti")
    .insert([
      {
        user_id: req.session.user.id,
        data_download: new Date().toISOString(),
        appunto_id: appuntoId,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return res.status(500).json({ error: "Errore nel salvare il" });
  }

  res.status(201).json(data);
});

/*Vede se l'utente con la sessione in corso ha quella card salvata */
router.get("/api/appunti/:appuntoId/preferiti", async (req, res) => {
  const { appuntoId } = req.params;

  const { data, error } = await supabase
    .from("preferiti")
    .select("*")
    .eq("appunto_id", appuntoId);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nel recupero dei file scaricati" });
  }
  res.json(data);
});

/*Usato in libreria >Appunti salvati :
restituisce tutti gli appunti salvati */
router.get("/api/preferiti_utente", async (req, res) => {
  const { data, error } = await supabase
    .from("preferiti")
    .select(`appunti(*,corso(*,facolta(*)))`)
    .eq("user_id", req.session.user.id);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nel recupero dei file scaricati" });
  }

  const appuntiScaricati = data.map((d) => d.appunti);
  res.json(appuntiScaricati);
});

router.delete("/api/preferiti", async (req, res) => {
  const { appunto_id } = req.body;

  const { data, error } = await supabase
    .from("preferiti")
    .delete()
    .eq("appunto_id", appunto_id)
    .eq("user_id", req.session.user.id);

  if (error) {
    return res
      .status(500)
      .json({ error: "Impossibile eliminare il preferito" });
  }

  return res.status(200).json({ message: "Preferito eliminato con successo" });
});

module.exports = router;
