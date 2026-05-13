import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadNota.css";
import "../../style/bootstrap.css";
import "../../style/buttons.css";

// CARICAMENTO NOTA
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const EXTENSION = "application/pdf";
const TITOLO_MIN = 10;
const TITOLO_MAX = 25;
const DESCRIZIONE_MAX = 500;

const API_FACOLTA_URL = "http://localhost:3000/api/facolta";
const API_CORSO_URL = "http://localhost:3000/api/corso";
const API_MATERIA_URL = "http://localhost:3000/api/materia";
const API_UPLOAD_URL = "http://localhost:3000/api/appunti";

function validaCaricamento({ file, titolo, facolta, corso, descrizione }) {
    const errori = [];
    const campiInErrore = new Set();

    if (!file) {
        errori.push("Devi selezionare un file da caricare.");
        campiInErrore.add("upload");
    } else {
        if (file.type !== EXTENSION) {
            errori.push("Il file deve essere in formato PDF.");
            campiInErrore.add("upload");
        }
        if (file.size > MAX_FILE_SIZE) {
            errori.push("Il file non può superare i " + (MAX_FILE_SIZE / 1024 / 1024) + " MB.");
            campiInErrore.add("upload");
        }
    }

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

    /*
    if (!materia) {
        errori.push("Devi selezionare una materia.");
        campiInErrore.add("materia");
    }
    */

    if (descrizione && descrizione.length > DESCRIZIONE_MAX) {
        errori.push("La descrizione non può superare i " + DESCRIZIONE_MAX + " caratteri.");
        campiInErrore.add("descrizione");
    }

    return { ok: errori.length === 0, errori, campiInErrore };
}

const initialFormState = {
    upload: null, nome: "", facolta: "", corso: "", descrizione: "",
};

export default function UploadNota() {
    const [formData, setFormData] = useState(initialFormState);
    const [campiInErrore, setCampiInErrore] = useState(() => new Set());
    const [tuttiValidi, setTuttiValidi] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] });
    const [facolta, setFacolta] = useState([]);
    const [corso, setCorso] = useState([]);
    const [materia, setMateria] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();



    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const nextValue = type === "file" ? (files[0]??null) :  value;

        setFormData((prev) => ({ ...prev, [name]: nextValue }));
        setCampiInErrore((prev) => {
            if(!prev.has(name))return prev;
            const next = new Set(prev);

            next.delete(name);
            return next;
        });
        setTuttiValidi(false);
        setFeedback((prev) => (prev.show ? { ...prev, show: false } : prev));
    };

    useEffect(() => {
        caricaFacolta();
    }, []);


    const caricaFacolta = async () => {
        try {
            const response = await fetch('/api/facolta')
            if (!response.ok) throw new Error("Errore nel caricamento delle materie");

            const facoltaData = await response.json();
            setFacolta(facoltaData);
            console.log(facolta)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        if (formData.facolta) caricaCorsi();
    },[formData.facolta])

    const caricaCorsi = async () => {
        try {
            const response = await fetch(`/api/corsi?facolta_id=${formData.facolta}`)
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
            file: formData.upload,
            titolo: formData.nome,
            facolta: formData.facolta,
            corso: formData.corso,
            descrizione: formData.descrizione,
        });

        if (ok) {
            try {
                const payload = new FormData();
                payload.append("file", formData.upload);
                payload.append("titolo", formData.nome.trim());
 
                payload.append("corso", formData.corso);
                payload.append("descrizione", formData.descrizione.trim());
                


                const response = await fetch(API_UPLOAD_URL, {
                    method: "POST",
                    body: payload,
                });

                if (response.ok) {
                    setFeedback({ show: true, type: "ok", errori: [] });
                    setTuttiValidi(true);
                    setCampiInErrore(new Set());
                    navigate("/homepage");
                    /*
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                    */
                } else {
                    throw new Error("Impossibile caricare la nota");
                }
            } catch (error) {
                console.error(error);
                setFeedback({ show: true, type: "error", errori: ["Errore di rete durante il caricamento. Riprova più tardi."] });
                setTuttiValidi(false);
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
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const classFor = (field) => {
        if (campiInErrore.has(field)) return "is-invalid";
        if (tuttiValidi) return "is-valid";
        return "";
    };

    return (
        <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card shadow-lg w-100" style={{ maxWidth: "520px" }}>
                <div className="card-body p-4 p-md-5 position-relative">
                    <div className="custom-border"></div>

                    <div className="text-center text-uppercase crest-text mb-2">Sapienza - Università di Roma</div>
                    <h1 className="text-center custom-title mb-1">Carica la tua nota</h1>
                    <p className="text-center text-muted fst-italic mb-4" style={{ fontSize: "0.875rem" }}>
                        Condividi le tue note con gli altri studenti
                    </p>

                    <form id="uploadForm" onSubmit={handleSubmit} noValidate>

                        <div className="mb-3">
                            <label htmlFor="upload" className="form-label custom-label">Scegli un file da caricare</label>
                            <input type="file" id="upload" name="upload" accept=".pdf,application/pdf" ref={fileInputRef} required onChange={handleChange} className={`form-control ${classFor("upload")}`} />
                            <div className="form-text">Solo file in formato .pdf (max 100 MB)</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label custom-label">Titolo nota</label>
                            <input type="text" id="nome" name="nome" required maxLength={TITOLO_MAX} value={formData.nome} onChange={handleChange} className={`form-control ${classFor("nome")}`} />
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
                            <label htmlFor="materia" className="form-label custom-label">Materia</label>
                            <select id="materia" name="materia" value={formData.materia} onChange={handleChange} className={`form-select ${classFor("materia")}`}>
                                <option value="" disabled>- Seleziona una materia per la tua nota -</option>

                                {materia.map(m => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}


                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="descrizione" className="form-label custom-label">Descrizione</label>
                            <textarea id="descrizione" name="descrizione" rows="6" maxLength={DESCRIZIONE_MAX} value={formData.descrizione} onChange={handleChange} className={`form-control ${classFor("descrizione")}`} />
                            <div className="form-text">Aggiungi una breve descrizione (facoltativa, max {DESCRIZIONE_MAX} caratteri)</div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn-custom">Carica nota</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Resetta il form</button>
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
