const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const upload = require("../middlewares/upload");
const generaThumbnail = require("../lib/thumbnail");


router.post("/api/appunti", upload.fields([{ name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }]), async (req, res) => {

  const file = req.files.file?.[0];
  const thumbnail = req.files.thumbnail?.[0];
  const { titolo, descrizione, corso, anno_riferimento} = req.body;


  if (!titolo || !corso || !file || !anno_riferimento) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  //Upload del file
  console.log("Upload file")
  const fileName = `${Date.now()}_${file.originalname}`;
  const { error: fileError } = await supabase.storage
    .from("AstraNote-files")
    .upload(fileName, file.buffer, { contentType: file.mimetype });

    console.log(fileError);
  if (fileError) {

    return res.status(500).json({ error: "Errore nel caricamento del file" });
  }

  console.log("Upload tthumbanil")
  //Upload della thumbnail
  const thumbName = `${Date.now()}_thumb.png`;
  const { error: thumbError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbName, thumbnail.buffer, {
        contentType: "image/png",
      });

    if (thumbError) {
      return res.status(500).json({ error: "Errore upload thumbnail" });
    }


    const { data: pdfUrlData } = supabase.storage
      .from("AstraNote-files")
      .getPublicUrl(fileName);

    const { data: thumbUrlData } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(thumbName);

    const url_file = pdfUrlData.publicUrl;
    const url_thumbnail = thumbUrlData.publicUrl;

 
  const { data, error: dbError } = await supabase
    .from("appunti")
    .insert([
      {
        titolo,
        data_creazione:new Date().toISOString(),
        id_autore:req.session.user.id,
        url_file: url_file,
        descrizione,
        corso,
        url_thumbnail: url_thumbnail,
        anno_riferimento,
      },
    ])
    .select();
    console.log("Upload file")
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
