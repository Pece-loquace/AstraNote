
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../style/bootstrap.css";
import "../style/buttons.css";

const TITOLO_MIN = 5;
const TITOLO_MAX = 25;
const DESCRIZIONE_MAX = 50;

function validaCaricamento({ file, titolo, facolta, corso, anno, descrizione }) {
    const errori = [];
    const campiInErrore = new Set();


    if (!titolo.trim()) {
        errori.push("Il campo titolo è obbligatorio.");
        campiInErrore.add("nome");
    } else if (titolo.trim().length < TITOLO_MIN) {
        errori.push("Il titolo deve contenere almeno " + TITOLO_MIN + " caratteri.");
        campiInErrore.add("nome");
    } else if (titolo.trim().length > TITOLO_MAX) {
        errori.push("Il titolo non può superare i " + TITOLO_MAX + " caratteri.");
        campiInErrore.add("nome");
    }

    if (!facolta) {
        errori.push("Devi selezionare una facoltà.");
        campiInErrore.add("facolta");
    }

    if (!corso) {
        errori.push("Devi selezionare un corso.");
        campiInErrore.add("corso");
    }

    if (!anno) {
        errori.push("Devi inserire un anno")
        campiInErrore.add("anno")
    }

    if (descrizione && descrizione.length > DESCRIZIONE_MAX) {
        errori.push("La descrizione non può superare i " + DESCRIZIONE_MAX + " caratteri.");
        campiInErrore.add("descrizione");
    }

    return { ok: errori.length === 0, errori, campiInErrore };
}

const initialFormState = {
    upload: "", titolo: "", facolta: "", corso: "", anno: "", descrizione: "",
};

export default function ModificaNote({ appunto: appuntoProp, onSave }) {
    const { id } = useParams();
    const [appunto, setAppunto] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [campiInErrore, setCampiInErrore] = useState(() => new Set());
    const [tuttiValidi, setTuttiValidi] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] });
    const [facolta, setFacolta] = useState([]);
    const [corso, setCorso] = useState([]);
    const [materia, setMateria] = useState([]);
    const [invioInCorso, setInvioInCorso] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleThumbnailReady = useCallback((blob) => {
        setThumbBlob(blob);
    }, []);



    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const nextValue = type === "file" ? (files[0] ?? null) : value;

        setFormData((prev) => ({ ...prev, [name]: nextValue }));
        if (name === "upload") setThumbBlob(null);
        setCampiInErrore((prev) => {
            if (!prev.has(name)) return prev;
            const next = new Set(prev);

            next.delete(name);
            return next;
        });
        setTuttiValidi(false);
        setFeedback((prev) => (prev.show ? { ...prev, show: false } : prev));
    };


    useEffect(() => {
        fetchFormData()
    }, [])

    const fetchFormData = async () => {
        try {
            let response = await fetch(`/api/appunti/${id}`)
            if (!response.ok) throw new Error("Errore nel reperire l'appunto");

            const nota = await response.json();
            console.log(nota);
            setFormData({
                upload: nota.url_file,
                titolo: nota.titolo,
                facolta: nota.corso.facolta.id,
                corso: nota.corso.id,
                anno: nota.anno_riferimento,
                descrizione: nota.descrizione,
            });
            setAppunto(nota);


            response = await fetch('/api/facolta')
            if (!response.ok) throw new Error("Errore nel caricamento delle materie");

            const facoltaData = await response.json();
            setFacolta(facoltaData);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        if (!formData.facolta) return;
        caricaCorsi();
    }, [formData.facolta])

    const caricaCorsi = async () => {
        if (!formData.facolta) return;
        try {
            console.log(appunto);
            const response = await fetch(`/api/corsi?facolta_id=${formData.facolta}`)

            console.log("Status:", response.status);
            console.log("Content-Type:", response.headers.get("content-type"));
            if (!response.ok) throw new Error("Impossibile caricare i corsi")

            const corsi = await response.json()
            setCorso(corsi)
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, errori, campiInErrore: listaErrori } = validaCaricamento({
            titolo: formData.titolo,
            facolta: formData.facolta,
            corso: formData.corso,
            anno: formData.anno,
            descrizione: formData.descrizione,
        });

        if (ok) {
            setInvioInCorso(true);
            try {
                const response = await fetch(`/api/appunti/${appunto.id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "titolo": formData.titolo,
                        "corso": formData.corso,
                        "anno_riferimento": formData.anno,
                        "descrizione": formData.descrizione
                    })
                });

                if (response.ok) {
                    setFeedback({ show: true, type: "ok", errori: [] });
                    setTuttiValidi(true);
                    setCampiInErrore(new Set());
                    navigate("/libreria");

                } else {
                    throw new Error("Impossibile caricare la nota");
                }
            } catch (error) {
                console.error(error);
                const messaggio =
                    error?.message?.includes("anteprima") || error?.message?.includes("PDF")
                        ? "Impossibile generare l'anteprima del PDF. Prova con un altro file."
                        : "Errore di rete durante il caricamento. Riprova più tardi.";
                setFeedback({ show: true, type: "error", errori: [messaggio] });
                setTuttiValidi(false);
            } finally {
                setInvioInCorso(false);
            }

        } else {
            setFeedback({ show: true, type: "error", errori });
            setCampiInErrore(listaErrori);
            setTuttiValidi(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setCampiInErrore(new Set());
        setTuttiValidi(false);
        setFeedback({ show: false, type: "", errori: [] });
        setThumbBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const classFor = (field) => {
        if (campiInErrore.has(field)) return "is-invalid";
        if (tuttiValidi) return "is-valid";
        return "";
    };

    return (
        <main className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
            <div className="card shadow-lg w-100" style={{ maxWidth: "850px" }}>
                <div className="card-body p-4 p-md-5 position-relative">
                    <div className="custom-border"></div>

                    <h1 className="text-center custom-title mb-1">Modifica la tua nota</h1>
                    <p className="text-center text-muted fst-italic mb-4" style={{ fontSize: "0.875rem" }}>
                        Condividi le tue note con gli altri studenti
                    </p>

                    <form id="uploadForm" onSubmit={handleSubmit} noValidate>

                        <div className="mb-3">
                            <label htmlFor="upload" className="form-label custom-label">Scegli un file da caricare</label>
                            <input type="file" id="upload" name="upload" disabled className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label custom-label">Titolo nota</label>
                            <input type="text" id="nome" name="nome" required maxLength={TITOLO_MAX} value={formData.titolo} onChange={handleChange} className={`form-control ${classFor("nome")}`} />
                            <div className="form-text">Il titolo sarà visibile a tutti gli studenti</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="facolta" className="form-label custom-label">Facoltà</label>
                            <select id="facolta" name="facolta" required value={formData.facolta} onChange={handleChange} className={`form-select ${classFor("facolta")}`}>
                                <option value="" disabled>- Seleziona la facoltà per la tua nota -</option>
                                {facolta.map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="corso" className="form-label custom-label">Corso</label>
                            <select id="corso" name="corso" value={formData.corso} onChange={handleChange} className={`form-select ${classFor("corso")}`}>
                                <option value="" disabled>- Seleziona un corso per la tua nota -</option>

                                {corso.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}


                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="anno" className="form-label custom-label">Anno di riferimento</label>
                            <select id="anno" name="anno" value={formData.anno} onChange={handleChange} className={`form-select ${classFor("anno")}`}>
                                <option value="" disabled>-Seleziona un anno -</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="descrizione" className="form-label custom-label">Descrizione</label>
                            <textarea id="descrizione" name="descrizione" rows="6" maxLength={DESCRIZIONE_MAX} value={formData.descrizione} onChange={handleChange} className={`form-control ${classFor("descrizione")}`} />
                            <div className="form-text">Aggiungi una breve descrizione (facoltativa, max {DESCRIZIONE_MAX} caratteri)</div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn-custom" disabled={invioInCorso}>
                                {invioInCorso ? "Caricamento in corso…" : "Modifica nota"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Resetta il form</button>
                            <Link to="/libreria" className="btn btn-outline-secondary">Indietro</Link>
                        </div>

                        {feedback.show && (
                            <div className={`alert mt-4 ${feedback.type === "ok" ? "alert-success" : "alert-danger"}`} role="alert">
                                {feedback.type === "ok" ? (
                                    "Nota caricata con successo! Grazie per aver condiviso i tuoi appunti."
                                ) : (
                                    <>
                                        <strong className="d-block mb-2">Impossibile caricare la nota:</strong>
                                        <ul className="mb-0">
                                            {feedback.errori.map((err, i) => (
                                                <li className="text-start" key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
