import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import Avatar, {
    AVATAR_ICONE,
    AVATAR_COLORI,
    COLORI,
} from "../../components/Avatar";

// Modifica Profilo

export default function Impostazioni() {
    const navigate = useNavigate();

    // stati
    const [utente, setUtente] = useState(null);
    const [listaFacolta, setListaFacolta] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [salvataggio, setSalvataggio] = useState(false);
    const [errore, setErrore] = useState(null);
    const [successo, setSuccesso] = useState(null);

    const [form, setForm] = useState({
        nome: "",
        cognome: "",
        matricola: "",
        facolta: "",
        password: "",
        nuovaPassword: "",
        confermaPassword: "",
        avatar: {
            iconaId: AVATAR_ICONE[0].id,
            iconaColore: "bianco",
            sfondoColore: "rosso",
        },
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
                setForm((prev) => ({
                    ...prev,
                    nome: user.nome || "",
                    cognome: user.cognome || "",
                    matricola: user.matricola || "",
                    facolta: user.facolta || "",
                    avatar: {
                        iconaId: user.avatar?.iconaId || AVATAR_ICONE[0].id,
                        iconaColore: user.avatar?.iconaColore || "bianco",
                        sfondoColore: user.avatar?.sfondoColore || "rosso",
                    },
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

    // helper
    const setField = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const setAvatar = (key, value) =>
        setForm((prev) => ({ ...prev, avatar: { ...prev.avatar, [key]: value } }));

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
            // sostituire con l'endpoint reale di aggiornamento profilo
            // verifica il metodo che ha il backend sia PUT o POST
            const res = await fetch(`/api/utente/${utente.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // adatta il payload ai nomi che il backend si aspetta.
                // se il server non gestisce il cambio password in questo endpoint,
                // rimuovi i tre campi password da qui e crea una chiamata separata.
                body: JSON.stringify({
                    nome: form.nome,
                    facolta: form.facolta,
                    avatar: form.avatar,
                    passwordAttuale: form.password || undefined,
                    nuovaPassword: form.nuovaPassword || undefined,
                }),
            });

            if (!res.ok) {
                // se il backend restituisce un messaggio JSON tipo { errore: "..." },
                // puoi estrarlo qui e mostrarlo all'utente
                throw new Error("Errore durante il salvataggio del profilo");
            }

            setSuccesso("Modifiche salvate correttamente!");

            // decidi se reindirizzare subito o lasciare il messaggio visibile.
            // Adesso il sito aspetta 1 secondo per far leggere il messaggio, poi torna al profilo.
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

                    {/* Colonna sinistra: personalizza avatar */}
                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3">
                                <h3 className="fw-semibold mb-4">Avatar</h3>

                                <div className="text-center mb-4">
                                    <Avatar
                                        iconaId={form.avatar.iconaId}
                                        iconaColore={form.avatar.iconaColore}
                                        sfondoColore={form.avatar.sfondoColore}
                                        size={140}
                                    />
                                </div>

                                <label className="form-label small fw-medium text-uppercase text-muted">
                                    Icona
                                </label>
                                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                    {AVATAR_ICONE.map(({ id, descrizione, Component }) => {
                                        const selected = form.avatar.iconaId === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setAvatar("iconaId", id)}
                                                className={`btn p-2 ${selected ? "btn-primary" : "btn-outline-secondary"
                                                    }`}
                                                style={{ width: 48, height: 48, lineHeight: 0 }}
                                                title={descrizione}
                                                aria-label={descrizione}
                                                aria-pressed={selected}
                                            >
                                                <Component
                                                    color={selected ? "#fff" : "#000"}
                                                    size={28}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                <label className="form-label small fw-medium text-uppercase text-muted mt-4 p-1">
                                    Colore icona
                                </label>
                                <ColoreSelezione
                                    selected={form.avatar.iconaColore}
                                    onSelect={(colore) => setAvatar("iconaColore", colore)}
                                />

                                <label className="form-label small fw-medium text-uppercase text-muted mt-4 p-1">
                                    Colore sfondo
                                </label>
                                <ColoreSelezione
                                    selected={form.avatar.sfondoColore}
                                    onSelect={(colore) => setAvatar("sfondoColore", colore)}
                                />
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
                                            onChange={(e) => setField("nome", e.target.value)}
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
                                            onChange={(e) => setField("cognome", e.target.value)}
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
                                            onChange={(e) => setField("matricola", e.target.value)}
                                            disabled
                                        />
                                    </div>

                                    {/* Seleziona la facoltà — popolato dal server */}
                                    <div className="col-sm-6">
                                        <label htmlFor="facolta" className="form-label">
                                            Facoltà
                                        </label>
                                        {/* se il backend restituisce campi con nomi diversi,
                                            modifica `f.id` e `f.nome` qui sotto.
                                            Esempi alternativi: f.codice / f.denominazione */}
                                        <select
                                            id="facolta"
                                            className="form-select"
                                            value={form.facolta}
                                            onChange={(e) => setField("facolta", e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Seleziona una facoltà
                                            </option>
                                            {listaFacolta.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.nome}
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
                                            onChange={(e) => setField("password", e.target.value)}
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
                                            onChange={(e) =>
                                                setField("nuovaPassword", e.target.value)
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
                                            onChange={(e) =>
                                                setField("confermaPassword", e.target.value)
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
                                    {/* TODO: verificare la rotta /profilo */}
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

// ---- Selezione colori ----
function ColoreSelezione({ selected, onSelect }) {
    return (
        <div className="d-flex flex-wrap justify-content-center gap-2">
            {COLORI.map((chiaveColore) => {
                const isSelected = selected === chiaveColore;
                const color = AVATAR_COLORI[chiaveColore];
                return (
                    <button
                        key={chiaveColore}
                        type="button"
                        onClick={() => onSelect(chiaveColore)}
                        title={maiuscolo(chiaveColore)}
                        aria-label={maiuscolo(chiaveColore)}
                        aria-pressed={isSelected}
                        className="btn p-0 rounded-circle"
                        style={{
                            width: 36,
                            height: 36,
                            backgroundColor: color,
                            border: isSelected
                                ? "3px solid rgb(15, 110, 255)"
                                : "1px solid rgb(195, 195, 195)",
                            boxShadow: isSelected ? "0 0 0 2px #fff inset" : "none",
                        }}
                    />
                );
            })}
        </div>
    );
}

function maiuscolo(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}