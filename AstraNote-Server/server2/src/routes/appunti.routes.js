const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const upload = require("../middlewares/upload");
const generaThumbnail = require("../lib/thumbnail");

/*********************CRUD Appunti************/

// app.post('/api/appunti', upload.single('file'), async(req,res) => {
//     const file = req.file;
//     const {titolo,descrizione,corso,anno_riferimento} = req.body;
//     const data_creazione = new Date().toISOString();
//     const id_autore = req.session.user.id;
//
//     if(!titolo || !corso ){
//         console.log("Non sono presenti tutti i campi")
//         return res.status(400).json({error: "Tutti i campi sono obbligatori"});
//     }
//
//     const fileName = `${Date.now()}_${file.originalname}`;
//     //Upload del file su supabase
//     const responseUpload = await supabase.storage
//         .from('AstraNote-files')
//         .upload(`${Date.now()}_${file.originalname}`,file.buffer,{
//             contentType: file.mimetype
//         });
//
//     if(responseUpload.error){
//         console.error(responseUpload.error);
//         return res.status(200).json({error:"Errore nell'upload del file"})
//     }
//
//     //Ottengo l'URL pubblico
//     const urlData = supabase.storage
//         .from('AstraNote-files')
//         .getPublicUrl(fileName)
//         .data;
//     const publicUrl = urlData.publicUrl;
//
//
//     // 2. Genera la thumbnail dalla prima pagina
//     let url_thumbnail = null;
//     try {
//         const converter = fromBuffer(file.buffer, {
//             density: 100,
//             format: "jpg",
//             width: 400,
//             height: 600,
//         });
//
//         console.log("Dimensione buffer PDF:", file.buffer.length);
//
//         // FIX: Aggiungi l'oggetto opzioni come secondo parametro qui!
//         const risultato = await converter(1, { responseType: "buffer" });
//
//         if (risultato && risultato.buffer) {
//             console.log("Dimensione buffer Thumbnail:", risultato.buffer.length);
//             const thumbBuffer = risultato.buffer;
//
//             const thumbName = `${Date.now()}_thumb.jpg`;
//             const { data: thumbData, error: thumbError } = await supabase.storage
//                 .from('thumbnails')
//                 .upload(thumbName, thumbBuffer, {
//                     contentType: 'image/jpeg'
//                 });
//
//             if (!thumbError) {
//                 url_thumbnail = supabase.storage.from('thumbnails').getPublicUrl(thumbName).data.publicUrl;
//             } else {
//                 console.error("Errore upload thumbnail su Supabase:", thumbError);
//             }
//         } else {
//             console.error("Il convertitore non ha restituito un buffer valido.");
//         }
//     } catch (err) {
//         console.error("Errore generazione thumbnail:", err);
//     }
//
//     const { data, error: dbError } = await supabase
//         .from('appunti')
//         .insert([
//             {
//                 titolo:titolo,
//                 data_creazione:data_creazione,
//                 id_autore: id_autore,
//                 url_file: publicUrl,
//                 descrizione:descrizione,
//                 corso:corso,
//                 url_thumbnail: url_thumbnail,
//                 anno_riferimento: anno_riferimento
//             }
//         ])
//         .select();
//
//     if(dbError){
//              console.error("ERRORE DATABASE DETTAGLIATO:", dbError);
//              return res.status(500).json({error:"Errore nell'inserimento dei dati"})
//     }
//     //Invio i dati in formato JSON
//     res.status(201).json({
//         message: "Appunto aggiunto con successo!",
//         recensione: data[0]
//     })
// })

router.post("/api/appunti", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { titolo, descrizione, corso, anno_riferimento } = req.body;

  if (!titolo || !corso || !file) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const id_autore = req.session.user.id;
  const data_creazione = new Date().toISOString();
  const fileName = `${Date.now()}_${file.originalname}`;

  // Genera thumbnail e upload file in parallelo
  const [responseUpload, thumbBuffer] = await Promise.all([
    supabase.storage
      .from("AstraNote-files")
      .upload(fileName, file.buffer, { contentType: file.mimetype }),
    generaThumbnail(file.buffer), // funzione estratta sotto
  ]);

  if (responseUpload.error) {
    return res.status(500).json({ error: "Errore nell'upload del file" });
  }

  // Upload thumbnail e URL file in parallelo
  const publicUrl = supabase.storage
    .from("AstraNote-files")
    .getPublicUrl(fileName).data.publicUrl;

  let url_thumbnail = null;
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

  const { data, error: dbError } = await supabase
    .from("appunti")
    .insert([
      {
        titolo,
        data_creazione,
        id_autore,
        url_file: publicUrl,
        descrizione,
        corso,
        url_thumbnail,
        anno_riferimento,
      },
    ])
    .select();

  if (dbError) {
    return res.status(500).json({ error: "Errore nell'inserimento dei dati" });
  }

  res
    .status(201)
    .json({ message: "Appunto aggiunto con successo!", appunto: data[0] });
});

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
    .select("*")
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
