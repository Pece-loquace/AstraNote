import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import profileDefault from "../../assets/profile-circle.svg";
import "./Impostazioni.css"

// Modifica Profilo
const FILE_MAX = 100 * 1024 * 1024; //(100MB)

// stesse costanti di Register/Login per coerenza di validazione
const PASSWORD_MIN = 8;
const MINUSCOLA_REGEX = /[a-z]/;
const MAIUSCOLA_REGEX = /[A-Z]/;
const SIMBOLO_REGEX = /[^A-Za-z0-9]/;
const NUMBER_REGEX = /[0-9]/;

// stesso schema URL usato in Register.jsx / Login.jsx
const API_BASE = "http://localhost:3000/api";

// valida i campi modificabili in impostazioni
function validaImpostazioni({ nome, facolta, password, nuovaPassword, confermaPassword }) {
    const errori = [];
    const campiInErrore = new Set();

    if (!nome.trim()) {
        errori.push("Il campo nome è obbligatorio.");
        campiInErrore.add("nome");
    }

    if (!facolta) {
        errori.push("Devi selezionare una facoltà.");
        campiInErrore.add("facolta");
    }

    if (!password) {
        errori.push("Devi inserire la password attuale per confermare le modifiche.");
        campiInErrore.add("password");
    }

    // la nuova password è opzionale: se vuota, niente cambio password
    if (nuovaPassword) {
        if (nuovaPassword.length < PASSWORD_MIN) {
            errori.push("La nuova password deve essere di almeno " + PASSWORD_MIN + " caratteri.");
            campiInErrore.add("nuovaPassword");
        }
        if (!MINUSCOLA_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno una lettera minuscola (a-z).");
            campiInErrore.add("nuovaPassword");
        }
        if (!MAIUSCOLA_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno una lettera maiuscola (A-Z).");
            campiInErrore.add("nuovaPassword");
        }
        if (!NUMBER_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno un numero (0-9).");
            campiInErrore.add("nuovaPassword");
        }
        if (!SIMBOLO_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno un simbolo.");
            campiInErrore.add("nuovaPassword");
        }
        if (nuovaPassword !== confermaPassword) {
            errori.push("La nuova password e la conferma non coincidono.");
            campiInErrore.add("nuovaPassword");
            campiInErrore.add("confermaPassword");
        }
    } else if (confermaPassword) {
        // ha riempito la conferma ma non la nuova password
        errori.push("Inserisci anche la nuova password.");
        campiInErrore.add("nuovaPassword");
    }

    return { ok: errori.length === 0, errori, campiInErrore };
}

export default function Impostazioni() {
    const navigate = useNavigate();

    // stati
    const [utente, setUtente] = useState(null);
    const [listaFacolta, setListaFacolta] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [salvataggio, setSalvataggio] = useState(false);

    // unico stato feedback, stesso pattern di Login/Register
    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] });
    const [campiInErrore, setCampiInErrore] = useState(() => new Set());
    const [tuttiValidi, setTuttiValidi] = useState(false);

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

    // fetch dei dati iniziali (utente loggato + lista facoltà)
    useEffect(() => {
        const fetchDati = async () => {
            try {
                setCaricamento(true);

                // URL assoluto come in Register/Login per coerenza
                const resUser = await fetch("/api/utente_loggato");
                if (!resUser.ok) throw new Error("Errore nel reperire l'utente loggato");
                const user = await resUser.json();
                setUtente(user);

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
                setFeedback({ show: true, type: "error", errori: [err.message] });
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

    // helper: aggiorna un campo e pulisce eventuale stato di errore su di esso
    // (stesso comportamento di handleChange in Login/Register)
    const setField = (key, value) => {
        setForm((statoPrecendete) => ({ ...statoPrecendete, [key]: value }));

        setCampiInErrore((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
        setTuttiValidi(false);
        setFeedback((prev) => (prev.show ? { ...prev, show: false } : prev));
    };

    // gestione upload foto
    const handleFotoChange = (evento) => {
        const file = evento.target.files?.[0];
        if (!file) return;

        // controllo base: solo immagini, max 100 MB
        if (!file.type.startsWith("image/")) {
            setFeedback({ show: true, type: "error", errori: ["Il file selezionato non è un'immagine valida"] });
            return;
        }
        if (file.size > FILE_MAX) {
            setFeedback({ show: true, type: "error", errori: ["L'immagine non può superare i 100 MB"] });
            return;
        }

        // rilascia eventuale anteprima precedente prima di crearne una nuova
        if (fotoPreview && fotoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(fotoPreview);
        }

        setFeedback({ show: false, type: "", errori: [] });
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
        fotoPreview || utente?.image_url || profileDefault;

    // helper per assegnare classi is-valid / is-invalid (come in Login/Register)
    const classFor = (field) => {
        if (campiInErrore.has(field)) return "is-invalid";
        if (tuttiValidi) return "is-valid";
        return "";
    };

    // salvataggio
    const handleSubmit = async (evento) => {
        evento.preventDefault();

        const { ok, errori, campiInErrore: nuoviErrori } = validaImpostazioni(form);

        if (!ok) {
            setFeedback({ show: true, type: "error", errori });
            setCampiInErrore(nuoviErrori);
            setTuttiValidi(false);
            return;
        }

        try {
            setSalvataggio(true);
            setFeedback({ show: true, type: "ok", errori: [] });
            setCampiInErrore(new Set());
            setTuttiValidi(true);

            const payload = new FormData();
            payload.append("nome", form.nome);
            payload.append("facolta", form.facolta);
            payload.append("passwordAttuale", form.password);
            if (form.nuovaPassword) payload.append("nuovaPassword", form.nuovaPassword);
            if (fotoFile) payload.append("foto", fotoFile);

            const risposta = await fetch("/api/utenti/id", {
                method: "PUT",
                credentials: "include",
                body: payload,
            });

            if (risposta.ok) {
                setFeedback({ show: true, type: "ok", errori: [] });
                // aspetta 1s per far leggere il messaggio, poi torna al profilo
                setTimeout(() => navigate(`/utente/${utente.id}`), 1000);
            } else {
                // stessa logica di parsing errori usata in Login/Register:
                // il backend può restituire un array oppure { error } / { message }
                const error = await risposta.json().catch(() => ({}));
                const erroriBackend = Array.isArray(error)
                    ? error
                    : [error.error || error.message || "Errore durante il salvataggio del profilo"];

                setFeedback({ show: true, type: "error", errori: erroriBackend });
                setCampiInErrore(new Set());
                setTuttiValidi(false);
            }
        } catch (err) {
            console.error(err);
            setFeedback({ show: true, type: "error", errori: [err.message] });
            setTuttiValidi(false);
        } finally {
            setSalvataggio(false);
        }
    };

    // render
    if (caricamento) {
        return <div className="container py-5 text-center">Caricamento…</div>;
    }

    if (feedback.show && feedback.type === "error" && !utente) {
        return (
            <div className="container py-5 text-center text-danger">
                Errore: {feedback.errori.join(", ")}
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

            <form onSubmit={handleSubmit} noValidate>
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

                                <div className="d-flex flex-column gap-2">
                                    <input
                                        ref={inputFotoRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="form-control"
                                        id="foto-input"
                                    />

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
                                            className={`form-control ${classFor("nome")}`}
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
                                        <select
                                            id="facolta"
                                            className={`form-select ${classFor("facolta")}`}
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
                                            className={`form-control ${classFor("password")}`}
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
                                            className={`form-control ${classFor("nuovaPassword")}`}
                                            value={form.nuovaPassword}
                                            onChange={(evento) =>
                                                setField("nuovaPassword", evento.target.value)
                                            }
                                            autoComplete="new-password"
                                        />
                                        <div className="form-text">
                                            Lascia vuoto se non vuoi cambiarla. Almeno 8 caratteri:
                                            una minuscola, una maiuscola, un numero e un simbolo.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="confermaPassword" className="form-label">
                                            Conferma Password
                                        </label>
                                        <input
                                            id="confermaPassword"
                                            type="password"
                                            className={`form-control ${classFor("confermaPassword")}`}
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

                                {/* Feedback unico, stesso pattern di Login/Register */}
                                {feedback.show && (
                                    <div className={`alert mt-4 ${feedback.type === "ok" ? "alert-success" : "alert-danger"}`} role="alert">
                                        {feedback.type === "ok" ? (
                                            salvataggio
                                                ? "Tutti i campi sono corretti, salvataggio in corso..."
                                                : "Modifiche salvate correttamente!"
                                        ) : (
                                            <>
                                                <strong className="d-block mb-2">Impossibile salvare le modifiche:</strong>
                                                <ul className="mb-0">
                                                    {feedback.errori.map((err, i) => (
                                                        <li className="text-start" key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
