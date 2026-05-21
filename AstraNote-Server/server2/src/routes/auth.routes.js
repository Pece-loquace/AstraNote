const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const upload = require("../middlewares/upload");

//---------------------SESSIONI---------------------

/*Accede ai dati utente quando vado nell'homepage */
router.get("/api/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "Non sei loggato" });
  }
});

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const { data: user, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("email", email)
    .single();

  if (!user || error) {
    return res.status(401).json({ error: "Utente non trovato" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

  if (isPasswordCorrect) {
    req.session.user = {
      id: user.id,
      cognome: user.cognome,
      email: user.email,
    };

    res.json({ message: "Login !", user: req.session.user });
  } else {
    res.status(401).json({ error: "password" });
  }
});

/*Carica i dati quando clicca sul profilo-navbar */
router.get("/api/carica_utente", async (req, res) => {
  try {
    const user = req.session.user;
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  const user = req.session.user;

  //---Carica l'immagine--
  const { image, error } = await supabase.storage
    .from("ProfileImages")
    .getPublicUrl(utente.image_url);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nel recupero dell'immagine" });
  }

  const imageUrl = image.publicUrl;

  //--Carica il nome della facoltà--
  const { nomeFacolta } = await supabase
    .from("Facoltà")
    .select(`nome`)
    .eq("nome", user.facolta);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nel recupero della facoltà" });
  }

  //--Carica la valutazione media  dell'utente--
  const { media } = await supabase
    .from("user_ratings")
    .select("*")
    .eq("id", user.id);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore nel recupero della facoltà" });
  }

  user.valutazione = media;

  res.status().json({
    utente: user,
    image_url: imageUrl,
    facoltà: nomeFacolta,
  });
});

router.post("/api/register", upload.single("file"), async (req, res) => {
  const { nome, cognome, matricola, email, password, facolta } = req.body;

  if (!nome || !cognome || !matricola || !email || !password || !facolta) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  console.log("Tutti i campi sono stati riempiti");

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "La password deve avere almeno 8 caratteri" });
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("utenti")
      .insert([
        {
          nome: nome,
          cognome: cognome,
          matricola: matricola,
          email: email,
          password_hash: hash,
          facolta: facolta,
        },
      ])
      .select();

    //Se io metto un'email già usata viene violato un vincolo di chiave
    //e se io lo violo postresql restituisce un codice di errore 23505
    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Questa email è già registrata" });
      }
      throw error;
    }

    //Faccio partire una nuova sessione e riempio il campo
    //"sess" con i dati utente di base
    req.session.user = {
      id: data[0].id,
      nome: data[0].nome,
      email: data[0].email,
    };

    res.status(201).json({
      message: "Utente creato con successo!",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Errore registrazione:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Errore durante il logout:", err);
      return res.status(500).json({ error: "Impossibile effettuare il logout" });
    }

    res.clearCookie("connect.sid");

    res.json({ message: "Logout effettuato con successo" });
  });
});

module.exports = router;
