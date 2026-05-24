import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import profileDefault from "../../assets/profile-circle.svg";
import "./Impostazioni.css"

// Modifica Profilo

const FILE_MAX = 100 * 1024 * 1024; //(100MB)

export default function Impostazioni() {
    const navigate = useNavigate();

    // stati
    const [utente, setUtente] = useState(null);
    const [listaFacolta, setListaFacolta] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [salvataggio, setSalvataggio] = useState(false);
    const [errore, setErrore] = useState(null);
    const [successo, setSuccesso] = useState(null);

    // anteprima foto: tiene sia il File da caricare sia l'URL per la <img>
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const inputFotoRef = useRef(null);

    const [form, setForm] = useState({
        nome: "",
        cognome: "",
        matricola: "",
        facolta: "",
        password: "",
        nuovaPassword: "",
        confermaPassword: "",
    });

    // fetch
    useEffect(() => {
        const fetchDati = async () => {
            try {
                setCaricamento(true);

                // verifica che l'endpoint /api/utente_loggato sia corretto
                const resUser = await fetch("/api/utente_loggato");
                if (!resUser.ok) throw new Error("Errore nel reperire l'utente loggato");
                const user = await resUser.json();
                setUtente(user);

                // controlla se backend usa nomi di campo diversi,
                // modifica il rendering del <select> più sotto.
                const resFacoltaLista = await fetch("/api/facolta");
                if (!resFacoltaLista.ok) throw new Error("Errore nel reperire le facoltà");
                const facolta = await resFacoltaLista.json();
                setListaFacolta(facolta);

                // sincronizza il form con i dati dell'utente
                setForm((statoPrecendete) => ({
                    ...statoPrecendete,
                    nome: user.nome || "",
                    cognome: user.cognome || "",
                    matricola: user.matricola || "",
                    facolta: user.facolta || "",
                }));
            } catch (err) {
                console.error(err);
                setErrore(err.message);
            } finally {
                setCaricamento(false);
            }
        };

        fetchDati();
    }, []);

    // libera l'URL temporaneo dell'anteprima quando viene sostituita o
    // quando il componente viene smontato (evita memory leak)
    useEffect(() => {
        return () => {
            if (fotoPreview && fotoPreview.startsWith("blob:")) {
                URL.revokeObjectURL(fotoPreview);
            }
        };
    }, [fotoPreview]);

    // helper
    const setField = (key, value) =>
        setForm((statoPrecendete) => ({ ...statoPrecendete, [key]: value }));

    // gestione upload foto
    const handleFotoChange = (evento) => {
        const file = evento.target.files?.[0];
        if (!file) return;

        // controllo base: solo immagini, max 100 MB
        if (!file.type.startsWith("image/")) {
            setErrore("Il file selezionato non è un'immagine valida");
            return;
        }
        if (file.size > FILE_MAX) {
            setErrore("L'immagine non può superare i 100 MB");
            return;
        }

        // rilascia eventuale anteprima precedente prima di crearne una nuova
        if (fotoPreview && fotoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(fotoPreview);
        }

        setErrore(null);
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const rimuoviFotoSelezionata = () => {
        if (fotoPreview && fotoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(fotoPreview);
        }
        setFotoFile(null);
        setFotoPreview(null);
        if (inputFotoRef.current) {
            inputFotoRef.current.value = "";
        }
    };

    // sorgente da mostrare nell'anteprima: priorità a nuova selezione,
    // poi foto già salvata sul profilo, infine immagine di default
    const anteprimaSrc =
        fotoPreview || utente?.foto_profilo || profileDefault;

    // salvataggio
    const handleSubmit = async (evento) => {
        evento.preventDefault();
        setErrore(null);
        setSuccesso(null);

        // valida password lato client
        if (form.nuovaPassword && form.nuovaPassword !== form.confermaPassword) {
            setErrore("La nuova password e la conferma non coincidono");
            return;
        }

        try {
            setSalvataggio(true);

            // ⚠️ IMPORTANTE! ⚠️
            // Il backend deve accettare multipart/form-data su questo endpoint
            // per poter ricevere il file. Se la foto non viene modificata, il
            // campo "foto" non viene inviato e il backend deve mantenere quella
            // attuale.
            const formData = new FormData();
            formData.append("nome", form.nome);
            formData.append("facolta", form.facolta);
            if (form.password) formData.append("passwordAttuale", form.password);
            if (form.nuovaPassword) formData.append("nuovaPassword", form.nuovaPassword);
            if (fotoFile) formData.append("foto", fotoFile);

            // sostituire con l'endpoint reale di aggiornamento profilo
            const risposta = await fetch(`/api/utente/${utente.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!risposta.ok) {
                // se il backend restituisce un messaggio errore
                // si può mostrare all'utente da qui
                throw new Error("Errore durante il salvataggio del profilo");
            }

            setSuccesso("Modifiche salvate correttamente!");

            // adesso il sito aspetta 1 secondo per far leggere il messaggio, poi torna al profilo.
            setTimeout(() => navigate("/profilo"), 1000);
        } catch (err) {
            console.error(err);
            setErrore(err.message);
        } finally {
            setSalvataggio(false);
        }
    };

    // render
    if (caricamento) {
        return <div className="container py-5 text-center">Caricamento…</div>;
    }

    if (errore && !utente) {
        return (
            <div className="container py-5 text-center text-danger">
                Errore: {errore}
            </div>
        );
    }

    return (
        <div className="container py-4 py-md-5">
            <div className="d-flex align-items-center mb-4">
                <h1 className="h3 mb-0 fw-semibold">Modifica profilo</h1>
                <button type="button"
                    className="btn btn-link text-decoration-none ms-3"
                    onClick={() => navigate(-1)}>
                    ← Indietro
                </button>
            </div>

            {errore && <div className="alert alert-warning">{errore}</div>}
            {successo && <div className="alert alert-success">{successo}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">

                    {/* Colonna sinistra: foto profilo */}
                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3">
                                <h3 className="fw-semibold mb-4">Foto profilo</h3>

                                <div className="text-center mb-4">
                                    <img
                                        src={anteprimaSrc}
                                        alt="Anteprima foto profilo"
                                        className="foto-profilo-preview"
                                    />
                                </div>

                                {/* input file nascosto, attivato dal pulsante */}
                                <input
                                    ref={inputFotoRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    className="d-none"
                                    id="foto-input"
                                />

                                <div className="d-flex flex-column gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => inputFotoRef.current?.click()}
                                    >
                                        {fotoFile || utente?.foto_profilo
                                            ? "Cambia foto"
                                            : "Carica foto"}
                                    </button>

                                    {fotoFile && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={rimuoviFotoSelezionata}
                                        >
                                            Annulla selezione
                                        </button>
                                    )}
                                </div>

                                <p className="form-text text-center mt-3 mb-0">
                                    Formati supportati: JPG, PNG. Dimensione massima 100 MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colonna destra: Dati utente */}
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3">
                                <h3 className="fw-semibold mb-4">Dati Utente</h3>

                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label htmlFor="nome" className="form-label">
                                            Nome
                                        </label>
                                        <input
                                            id="nome"
                                            type="text"
                                            className="form-control"
                                            value={form.nome}
                                            onChange={(evento) => setField("nome", evento.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="cognome" className="form-label">
                                            Cognome
                                        </label>
                                        <input
                                            id="cognome"
                                            type="text"
                                            className="form-control"
                                            value={form.cognome}
                                            onChange={(evento) => setField("cognome", evento.target.value)}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="matricola" className="form-label">
                                            Matricola
                                        </label>
                                        <input
                                            id="matricola"
                                            type="text"
                                            className="form-control"
                                            value={form.matricola}
                                            onChange={(evento) => setField("matricola", evento.target.value)}
                                            disabled
                                        />
                                    </div>

                                    {/* Seleziona la facoltà — popolato dal server */}
                                    <div className="col-sm-6">
                                        <label htmlFor="facolta" className="form-label">
                                            Facoltà
                                        </label>
                                        {/* se il backend restituisce campi con nomi diversi,
                                            modifica `facoltà.id` e `facoltà.nome` qui sotto
                                         */}
                                        <select
                                            id="facolta"
                                            className="form-select"
                                            value={form.facolta}
                                            onChange={(evento) => setField("facolta", evento.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Seleziona una facoltà
                                            </option>
                                            {listaFacolta.map((facoltà) => (
                                                <option key={facoltà.id} value={facoltà.id}>
                                                    {facoltà.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={(evento) => setField("password", evento.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <div className="form-text">
                                            Inserisci la tua password attuale per confermare le modifiche
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="nuovaPassword" className="form-label">
                                            Nuova Password
                                        </label>
                                        <input
                                            id="nuovaPassword"
                                            type="password"
                                            className="form-control"
                                            value={form.nuovaPassword}
                                            onChange={(evento) =>
                                                setField("nuovaPassword", evento.target.value)
                                            }
                                            autoComplete="new-password"
                                        />
                                        <div className="form-text">
                                            Lascia vuoto se non vuoi cambiarla
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="confermaPassword" className="form-label">
                                            Conferma Password
                                        </label>
                                        <input
                                            id="confermaPassword"
                                            type="password"
                                            className="form-control"
                                            value={form.confermaPassword}
                                            onChange={(evento) =>
                                                setField("confermaPassword", evento.target.value)
                                            }
                                            autoComplete="new-password"
                                        />
                                        <div className="form-text">
                                            Ripeti la nuova password
                                        </div>
                                    </div>
                                </div>

                                {/* Pulsanti */}
                                <hr className="my-4" />
                                <div className="d-flex gap-2 justify-content-end">
                                    {/* verifica la rotta /profilo */}
                                    <button type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(-1)}>
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={salvataggio}
                                    >
                                        {salvataggio ? "Salvataggio…" : "Salva modifiche"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}