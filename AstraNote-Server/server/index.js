
//Importiamo express
const express = require('express')
const app = express() 

//Impostiamo la porta, (ecco perche mi ero collegato a localhost:3000)
const PORT = 3000
const HOST = '0.0.0.0' 


//IMPOSTIAMO LE ROTTE
const path = require("path") 
//Carica le variabili dal file .env
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const ROOT = path.join(__dirname,'..','dist') 

app.use(express.static(ROOT));  



//IMPOSTIAMO LE ROTTE
//QUERY SU DATABASE
const {createClient} = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

//Uso multer
const multer = require ('multer')
const upload = multer({storage: multer.memoryStorage()}) // Carica il file temporaneamente in RAM

/*********************CRUD Appunti************/
app.post('/api/appunti',upload.single('file'), async(req,res) => {
    const file = req.file;
    const {titolo,descrizione,data_creazione, id_autore,facoltà} = req.body;

    if(!titolo || !descrizione || !id_autore || !facoltà || !data_creazione){
        return res.status(400).json({error: "Tutti i campi sono obbligatori"});
    }

    //Upload del file su supabase
    const response = await supabase.storage
        .from('Appunti')
        .upload(`${Date.now()}_${file.originalname}`,file.buffer,{
            contentType: file.mimetype
        });
    
    if(response.error){
        console.error(error);
        return res.status(200).json({error:"Errore nell'upload del file"})
    }

    //Ottengo l'URL pubblico
    const urlData = supabase.storage
        .from("")
        .getPublicUrl(filePath)
        .data;
    const publicUrl = urlData.publicUrl; 


    response = await supabase 
        .from('appunti')
        .insert([
            {
                titolo:titolo,
                descrizione:descrizione,
                data_creazione:data_creazione,
                id_autore: id_autore,
                facoltà: facoltà,
            }    
        ]
        )
      
    if(response.error){
             return res.status(500).json({error:"Errore nell'inserimento dei dati"})
    }
    //Invio i dati in formato JSON
    res.status(201).json({
        message: "Appunto aggiunto con successo!",
        recensione: data[0]
    })
})

app.get('/api/appunti', async(req,res) => {
    const {error,data} = await supabase
        .from("appunti")
        .select()

    if(error){
        return res.status(500).json({error:"Errore durante il  recupero dei dati"})
    }
    res.json(data)
})

app.put('/api/appunti/:id', async(req,res) => {
    const idAppunto = req.params.id;
    const newData = req.body; 

    const response = await supabase
        .from('appunti')
        .update(newData)
        .eq("id",idAppunto)
        .select()
    
    if(response.error){
        return res.status(400).json({error: "Errore nell'update dei dati"})
    }

    res.json(response.data)
})

app.delete('/api/appunti/:id',async(req,res) => {
    const idAppunto = req.params.id;

    const response = await supabase
        .from('appunti')
        .delete()
        .eq('id',idAppunto)

    if(response.error) {
        return res.status(500).json({error: "Errore durante l'eliminazione dell'appunto"})
    }    
})


/*********************CRUD Segnalazioni ************/
app.post("/api/segnalazioni", async(req,res) => {
    const {utente_id , messaggio,created_at,appunto_id} = req.body;

    const {data,error} = await supabase
        .from('segnalazioni')
        .insert([
            {
                utente_id: utente_id,
                messaggio: messaggio,
                created_at: created_at,
                appunto_id: appunto_id
            }
        ])
        .select()

    if(error){
        return res.status(500).json({error: "Errore nella creazione della segnalazione"})
    }
    
    res.status(201).json({
        message: "Segnalazione aggiunta con successo!",
        recensione: data[0]
    })
})

app.get('/api/segnalazioni', async(req,res) =>{
    
    const {data,error} = await supabase
        .from('segnalazioni')
        .select('*')
    
    if(error){
        return res.status(500).json({error:"Errore nell'ottenere le segnalazioni"})
    }
    res.json(data)
})


app.get('/api/segnalazioni/:id' , async(req,res)=>{
    const idSegnalazione = req.params.id;

    const{data,error} = await supabase
        .from('segnalazioni')
        .select('*')
        .eq('id',idSegnalazione)
    
    if(error){
        return res.status(500).json({error:"Errore nel"})
    }

})

app.put('/api/segnalazioni/:id',async (req,res)=>{
    const idSegnalazione = req.params.id;
    const {messaggio,data_creazione,utente,appunto} = req.body
    const {data,error} = await supabase
        .from('segnalazioni')
        .update(
            {
                messaggio:messaggio,
                created_at:data_creazione,
                utente_id:utente,
                appunto_id: appunto,
            }
        )
        .eq('id',idSegnalazione)
        .select()
        .single()

    if(error){
        return res.status(500).json({error:"Errore nell'update"})
    }
    res.status(201).json({message:"Update effettuato con successo!"})
})

app.delete('/api/segnalazioni/:id',async(req,res)=>{
    const idSegnalazione = req.params.id;

    const {error} = await supabase
        .from('segnalazioni')
        .delete()
        .eq('id',idSegnalazione)

    if(error){
        return res.status(500).json({error:"Errore nell'eliminazione della segnalazione"})
    }
})

/*********************CRUD Recesioni************/
app.post('/api/recensioni',async(req,res)=>{
    const {appunti_id,utente_valutante,valutazione} = req.body;

    const {data,error} = await supabase 
        .from ('recensioni')
        .insert([
            {   
                appunti_id:appunti_id,
                utente_valutante: utente_valutante,
                valutazione: valutazione
            }
        ])
        .select()
    if(error){
        return res.status(500).json({error:"Errore nella creazione della recensione"})
    }

    res.status(201).json({
        message: "Recensione aggiunta con successo!",
        recensione: data[0]
    })
})

app.get('/api/recensioni',async(req,res)=>{

    const{data,error} = await supabase
        .from('recensioni')
        .select('*')
    
    if(error){
        return res.status(500).json({ error: "Errore durante la richiesta delle recensioni" });
    }

    res.json(data)
})


app.get('/api/recensioni/:id' ,async(req,res)=>{
    const recensioneId = req.params.id;

    const {data,error} = await supabase
        .from('recensioni')
        .select('*')
        .eq('id',)

    if(error){
        return res.status(500).json({error:"Errore nell'ottenere la recension"})
    }
    res.json(data);
})

app.put('/api/recensioni/:id',async(req,res)=>{
    const recensioneId = req.params.id;
    const{valutazione,appunti_id,utente_valutante} = req.body;

    const {data,error} = await supabase
        .from('recensioni')
        .update([
            {
                valutazione:valutazione,
            }
        ])
        .eq('id',recensioneId)
        .eq('utente_valutante', utente_valutante)
        .select('*')
        .single()

    if(error){
        return res.status(500).json({error:"Errore nell'ottenere la recension"})
    }
    res.json(data);
})


app.delete('/api/recensioni/:id' ,async(req,res)=>{
    const recensioneId = req.params.id;

    const {error} = await supabase
        .from('recensioni')
        .delete()
        .eq('id',recensioneId)

    if(error){
        res.status(500).json({error:"Errore nella delete della recensione"})
    }
})

/* -------------------Altri endpoint---------- */
/*Quando faccio il login nel mio sito devo vedere tutti i corsi che ho nella mia facoltà */
app.get('api/corsi' , async (req,res)=>{
    const facoltaId = req.body.facolta_id;

    const{data,error} = await supabase
        .from('corsi')
        .eq('facoltà',facoltaId)
    
    if(error){
        return res.status(500).json({error:"Errore nei corsi"})
    }   
    res.json(data)
})

/**/
app.get('/api/file_scaricati', async (req,res)=>{

    const {data,error} = await supabase
        .from('FileScaricati')
        .eq('user_id',req.session.user.id) 
    
    if(error){
        return res.status(500).json({error:"Errore nel recupero dei file scaricati"})
    }

    res.json(data)
})

/*Endpoint per restituire i corsi della facoltà nel momento del login */
app.get('/api/facolta/:id/corsi', async(req,res)=>{
    const idFacoltà = req.params.id;

    const {data,error} = await supabase
        .from('corsi')
        .select('*')
        .eq('facoltà',idFacolta)
    
    if(error){
        return res.status(500).json({error:"Errore nella query al database"})
    }
    res.json(data)
})

/*Carica le faocltà nel momento della registrazione*/
app.get('/api/facolta', async(req,res)=>{

    const {data,error} = await supabase
        .from('facolta')
    .select('id, nome')
    .limit(10)
    
        console.log(data)
        console.log(error)
    if(error){
        return res.status(500).json({error:"Errore nella query al database"})
    }
    res.json(data)
})



//---------------------SESSIONI---------------------

const session = require('express-session'); 
const pgSession = require('connect-pg-simple')(session); 
const { Pool } = require('pg'); 


const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // NECESSARIO per connettersi a Supabase da locale
});
// AGGIUNGI QUESTO LOG:
console.log("Tentativo di connessione al DB con stringa:", process.env.DATABASE_URL ? "Caricata correttamente" : "NON TROVATA!");

app.use(express.json());

//setup della gestione delle sessioni
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: false   //qui è importante specificare il nome giusto
  }),
  secret:'una_stringa_segreta_molto_lunga', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, //impostiamo la durata del cookie pari a 24 ore
    httpOnly: true //per non far leggere il cookie nel client (sicurezza)
  }
}));





const bcrypt = require('bcrypt') 

/*Accede ai dati utente quando vado nell'homepage */
app.get('/api/me', (req, res) => {

    
    if (req.session.user) {
        
        res.json(req.session.user);
    } else {
       
        res.status(401).json({ error: "Non sei loggato" });
    }
});

app.post("/api/login", async (req,res) =>{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const { data: user, error } = await supabase
        .from('utenti')
        .select('*')
        .eq('email', email)
        .single();

    if (!user || error) {
        return res.status(401).json({ error: "Utente non trovato" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if(isPasswordCorrect){
        
        
        req.session.user = { 
            id: user.id, 
            cognome: user.cognome, 
            email: user.email 
        };

        res.json({ message: "Login effettuato!", user: req.session.user});
    } else {
        res.status(401).json({ error: "Password errata" });
    }

})



/*Carica i dati quando clicca sul profilo-navbar */
app.get("/api/carica_utente", async(req,res)=>{
    try{
        const user = req.session.user;

    }catch(err){
       return res.status(500).json({error: err.message})
    }

    const user = req.session.user;

    //---Carica l'immagine--
    const {image,error} = await supabase.storage
        .from('ProfileImages')
        .getPublicUrl(utente.image_url)

    if(error){
        return res.status(500).json({error:"Errore nel recupero dell'immagine"})
    }

    const imageUrl = image.publicUrl

    //--Carica il nome della facoltà--
    const {nomeFacolta} = await supabase
        .from('Facoltà')
        .select(`nome`)
        .eq('nome', user.facolta)
        
    if(error){
        return res.status(500).json({error:"Errore nel recupero della facoltà"})
    }
    
    //--Carica la valutazione media  dell'utente--
    const {media} = await supabase
        .from('user_ratings')
        .select("*")
        .eq('id', user.id)
        
    if(error){
        return res.status(500).json({error:"Errore nel recupero della facoltà"})
    }

    user.valutazione = media;

    res.status().json({
        utente: user,
        image_url:imageUrl,
        facoltà:nomeFacolta
    })
})


app.post("/api/register", upload.single('file'), async (req, res) =>{
    const {nome,cognome,matricola,email, password,facolta} = req.body; 

    if (!nome || !cognome || !matricola || !email || !password || !facolta) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    console.log("Tutti i campi sono stati riempiti")
    /*
    //Upload dell'immagine
    const response = await supabase.storage
        .from('Appunti')
        .upload(`${Date.now()}_${file.originalname}`,file.buffer,{
            contentType: file.mimetype
        });
    
    if(response.error){
        console.error(error);
        return res.status(200).json({error:"Errore nell'upload del file"})
    }
    console.log("Immagine caricata con successo")

     //Ottengo l'URL pubblico
    const imageUrl = supabase.storage
        .from('Immagini')
        .getPublicUrl(filePath)
        .data;
    const publicUrl = urlData.publicUrl; 
    */

    if (password.length < 8) {
        return res.status(400).json({ error: "La password deve avere almeno 8 caratteri" });
    }

    try {         
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase
            .from('Utente')
            .insert([
                { 
                    nome: nome,
                    cognome: cognome,
                    matricola: matricola,
                    email: email, 
                    password_hash: hash,
                    facolta: facolta,
                }
            ])
            .select();

        //Se io metto un'email già usata viene violato un vincolo di chiave
        //e se io lo violo postresql restituisce un codice di errore 23505
        if (error) {
            if (error.code === '23505') { 
                return res.status(400).json({ error: "Questa email è già registrata" });
            }
            throw error;
        }

        //Faccio partire una nuova sessione e riempio il campo 
        //"sess" con i dati utente di base
        req.session.user = { 
            id: data[0].id, 
            nome: data[0].nome, 
            email: data[0].email 
        };

       
        res.status(201).json({ 
            message: "Utente creato con successo!",
            user: req.session.user 
        });

    } catch (err) {
        console.error("Errore registrazione:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }

})

app.post('/api/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            console.error("Errore durante il logout:", err);
            return res.status(500).json({ error: "Impossibile effettuare il logout" });
        }

        
        res.clearCookie('connect.sid'); 
        
        
        res.json({ message: "Logout effettuato con successo" });
    });
});



const redirectIfLoggedIn = (req, res, next) => {

    if (req.session.user) {
        
        return res.redirect('/'); 
    }
    
    
    next();
};


//Login 
app.get("/accedi/login", redirectIfLoggedIn, (req, res)=>{
    res.sendFile(path.join(ROOT, 'auth','login','index.html'))
})

//Registrazione
app.get("/accedi/registrazione", redirectIfLoggedIn, (req, res)=>{
    res.sendFile(path.join(ROOT, 'auth','registrazione','index.html'))
})


/*Middleware */
app.use((req,res) => {
 res.sendFile(path.join(ROOT,'index.html'));
});

//AVVIO 
app.listen(PORT, HOST, ()=>{
    console.log(`server in esecuzione su http://localhost:${PORT}`)
})

