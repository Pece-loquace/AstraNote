const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const upload = require("../middlewares/upload");
const generaThumbnail = require("../lib/thumbnail");


router.post("/api/appunti", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { titolo, descrizione, corso, anno_riferimento } = req.body;

  if (!titolo || !corso || !file) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  console.log("Upload thumbnail")
  // Upload thumbnail e URL file in parallelo

    const fileName = `${Date.now()}_${file.originalname}`;
    const { error: fileError } = await supabase.storage
      .from("AstraNote-files")
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (fileError) {
      return res.status(500).json({ error: "Errore nel caricamento del file" });
    }

  
  // 2. Ottieni l'URL pubblico del file
  const publicUrl = supabase.storage
    .from("AstraNote-files")
    .getPublicUrl(fileName).data.publicUrl;

  let url_thumbnail = null;
  const thumbBuffer = await generaThumbnail(file.buffer); // assicurati che la funzione accetti un buffer
  if (thumbBuffer) {
    const thumbName = `${Date.now()}_thumb.jpg`;
    const { error: thumbError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbName, thumbBuffer, { contentType: "image/jpeg" });

    if (!thumbError) {
      url_thumbnail = supabase.storage
        .from("thumbnails")
        .getPublicUrl(thumbName).data.publicUrl;
    }
  }

  const data_creazione = new Date().toISOString();


  const { data, error: dbError } = await supabase
    .from("appunti")
    .insert([
      {
        titolo,
        data_creazione,
        id_autore:req.session.user.id,
        url_file: publicUrl,
        descrizione,
        corso,
        url_thumbnail,
        anno_riferimento,
      },
    ])
    .select();
    console.log("Appunto caricato")
  if (dbError) {
    return res.status(500).json({ error: "Errore nell'inserimento dei dati" });
  }

  res
    .status(201)
    .json({ message: "Appunto aggiunto con successo!", appunto: data[0] });
});

/*Get per prendere il corso e la facoltà dell'appunto */
router.get("/api/appunti", async (req, res) => {
  const { error, data } = await supabase
    .from("appunti")
    .select("*,corso(*,facolta(*))");

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore durante il  recupero dei dati" });
  }
  res.json(data);
});

router.get("/api/appunti/:id", async(req,res) =>{
  const idAppunto = req.params.id;

  const{data,error} = await supabase 
    .from("appunti")
    .select("*,corso(*,facolta(*))")
    .eq("id",idAppunto)
    .single()

  if (error) {
    return res.status(400).json({ error: "Errore nell'update dei dati" });
  }

  res.json(data);
})


router.put("/api/appunti/:id", async (req, res) => {
  const idAppunto = req.params.id;
  const newData = req.body;

  const response = await supabase
    .from("appunti")
    .update(newData)
    .eq("id", idAppunto)
    .select();
    
  console.log(response.error);
  console.log(response.data);
  if (response.error) {
    return res.status(400).json({ error: "Errore nell'update dei dati" });
  }

  res.json(response.data);
});

function storagePathFromPublicUrl(publicUrl, bucket) {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const marker = `/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

router.delete("/api/appunti/:id", async (req, res) => {
  const idAppunto = req.params.id;
  const { url_thumbnail, url_file } = req.body;

  if (!url_file) {
    return res.status(400).json({ error: "url_file obbligatorio" });
  }

  const filePath = storagePathFromPublicUrl(url_file, "AstraNote-files");
  if (!filePath) {
    return res.status(400).json({ error: "url_file non valido" });
  }

  console.error("File path calcolato " + filePath);

  const { error: fileError } = await supabase.storage
    .from("AstraNote-files")
    .remove([filePath]);

  if (fileError) {
    console.error(fileError);
    return res
      .status(500)
      .json({ error: "Errore durante l'eliminazione del file" });
  }

  if (url_thumbnail) {
    const thumbPath = storagePathFromPublicUrl(url_thumbnail, "thumbnails");
    if (thumbPath) {
      const { error: thumbError } = await supabase.storage
        .from("thumbnails")
        .remove([thumbPath]);

      if (thumbError) {
        console.error(thumbError);
        return res.status(500).json({
          error: "Errore durante l'eliminazione della thumbnail",
        });
      }
    }
  }

  const { error: dbError } = await supabase
    .from("appunti")
    .delete()
    .eq("id", idAppunto);

  if (dbError) {
    console.error(dbError);
    return res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'appunto" });
  }

  res.status(200).json({ message: "Appunto eliminato con successo" });
});

router.get("/api/appunti_caricati", async (req, res) => {
  const { data, error } = await supabase
    .from("appunti")
    .select(`*,corso(*,facolta(*)))`)
    .eq("id_autore", req.session.user.id);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'appunto" });
  }
  res.json(data);
});

router.get("/api/appunti_caricati/:idUtente", async (req, res) => {
  console.log(req.params.idUtente);
  const { data, error } = await supabase
    .from("appunti")
    .select("*")
    .eq("id_autore", req.params.idUtente);

  console.log(data);
  console.log(error);

  if (error) {
    return res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'appunto" });
  }
  res.json(data);
});

module.exports = router;
