# AstraNote

**Piattaforma web per la ricerca e lo scambio di dispense autoprodotte tra studenti universitari.**

AstraNote nasce per chi ha cercato appunti per un esame senza sapere di chi fossero, o ha condiviso dispense senza ricevere riconoscimento. Gli studenti della Sapienza possono caricare i propri appunti in PDF, cercare quelli degli altri, valutarli e salvarli tra i preferiti, con l'autore sempre visibile.

---

## Funzionalità

- **Registrazione e login** riservati agli studenti: l'email deve avere il formato `nome.matricola@studenti.uniroma1.it`. Le password sono salvate con hash `bcrypt` e la sessione è gestita lato server (cookie `httpOnly`, durata 24 ore).
- **Caricamento appunti in PDF** (massimo 100 MB) con titolo, descrizione, facoltà, corso e anno di riferimento. L'anteprima del documento viene generata dal browser con `pdf.js` e salvata insieme al file.
- **Ricerca e filtri**: ricerca per parole del titolo, con filtri per facoltà, corso, anno e valutazione.
- **Valutazioni a stelle e recensioni** sugli appunti, con media delle valutazioni mostrata anche nel profilo dell'autore.
- **Preferiti e libreria personale**: raccolta degli appunti salvati e di quelli caricati.
- **Profilo utente** pubblico con gli appunti caricati e le valutazioni ricevute, e pagina **Impostazioni** per modificare i dati personali e la password.
- **Segnalazioni**: ogni utente può segnalare un appunto indicando il motivo.
- **Modifica ed eliminazione** dei propri appunti (con rimozione del file e dell'anteprima dallo storage).
- Pagine informative: Mission, Valori, Contattaci e Privacy Policy.

## Stack tecnologico

| Livello | Tecnologie |
|---|---|
| Frontend | React 19, Vite, React Router, Bootstrap 5, React Select, pdf.js (`pdfjs-dist`) |
| Backend | Node.js, Express 5, `express-session`, `connect-pg-simple`, Multer, bcrypt |
| Database e storage | Supabase (PostgreSQL e Storage) |

## Architettura

```
Browser (React + Vite, porta 5173 in sviluppo)
        │  fetch /api/...  (proxy Vite → localhost:3000)
        ▼
Server Express (porta 3000)
        ├── API REST sotto /api
        ├── sessioni salvate su PostgreSQL (tabella "session")
        ├── Supabase Storage: PDF, anteprime, immagini profilo
        └── in produzione serve anche il frontend compilato (cartella dist/)
```

In sviluppo il frontend gira su Vite e inoltra le chiamate `/api` al server. Con `npm run build` il client viene compilato direttamente in `AstraNote-Server/dist`, e il server Express lo serve insieme alle API, con un fallback su `index.html` per il routing lato client.

## Struttura del progetto

```
AstraNote/
├── AstraNote-Client/            # Applicazione React
│   └── src/
│       ├── views/               # Pagine: frontpage, homepage, search, libreria,
│       │                        #   upload, profilo, impostazioni, login/register, ...
│       ├── components/          # Navbar, CardAppunto, Filters, StelleValutazioni,
│       │                        #   Segnala, ModificaAppunto, AuthContext, ...
│       ├── style/               # Fogli di stile condivisi
│       └── assets/              # Logo e immagini
└── AstraNote-Server/
    └── server2/src/
        ├── config/              # env, cors, database, session, supabase
        ├── middlewares/         # upload (Multer)
        ├── routes/              # auth, appunti, catalogo, preferiti,
        │                        #   recensioni, segnalazioni, utenti
        └── static/              # fallback per la single page application
```

## API principali

| Risorsa | Endpoint |
|---|---|
| Autenticazione | `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me` |
| Appunti | `GET/POST /api/appunti`, `GET/PUT/DELETE /api/appunti/:id`, `GET /api/appunti/:id/dettagli`, `GET /api/appunti_caricati` |
| Catalogo | `GET /api/facolta`, `GET /api/facolta/:id/corsi`, `GET /api/corsi` |
| Preferiti | `GET/POST/DELETE /api/preferiti`, `GET /api/preferiti_utente` |
| Recensioni | `GET/POST/PUT /api/recensioni`, `DELETE /api/recensioni/:id` |
| Segnalazioni | `POST /api/segnalazioni`, `GET /api/segnalazioni_utente` |
| Utenti | `GET /api/utenti/:id`, `PUT /api/utenti/:id`, `GET /api/user_ratings/:idUtente` |

## Dati

Il progetto usa Supabase con queste entità: `utenti`, `appunti`, `facolta`, `corsi`, `preferiti`, `recensioni`, `segnalazioni`, la vista `user_ratings` e la tabella `session` per le sessioni. I file sono salvati in tre bucket di Storage: `AstraNote-files` (PDF), `thumbnails` (anteprime) e `ProfileImages` (immagini del profilo).

> Lo schema SQL non è incluso nel repository: per avviare il progetto in locale serve un progetto Supabase con queste tabelle e questi bucket.

## Avvio in locale

**Prerequisiti:** Node.js 18 o superiore e un progetto Supabase configurato come descritto sopra.

1. **Clona il repository**
   ```bash
   git clone https://github.com/Pece-loquace/AstraNote.git
   cd AstraNote
   ```

2. **Configura le variabili d'ambiente.** Crea il file `AstraNote-Server/.env`:
   ```env
   DATABASE_URL=postgresql://...      # connection string del database Supabase
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_KEY=...                   # chiave del progetto Supabase
   ```

3. **Avvia il server** (porta 3000)
   ```bash
   cd AstraNote-Server
   npm install
   npm run dev
   ```

4. **Avvia il client** (porta 5173), in un secondo terminale
   ```bash
   cd AstraNote-Client
   npm install
   npm run dev
   ```

5. Apri `http://localhost:5173`.

### Build di produzione

```bash
cd AstraNote-Client
npm run build        # compila in ../AstraNote-Server/dist
cd ../AstraNote-Server
npm run dev          # il server serve API e frontend su http://localhost:3000
```

## Possibili sviluppi

- Test automatici (al momento non sono presenti) e pipeline CI.
- Spostare il segreto di sessione in una variabile d'ambiente.
- Limitare la registrazione ad altre università e gestire la moderazione delle segnalazioni.
- Documentare lo schema del database con uno script SQL.
