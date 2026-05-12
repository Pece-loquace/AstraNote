import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import "./Register.css";
import "../../style/bootstrap.css"
import "../../style/buttons.css"


// REGISTRAZIONE STUDENTE SAPIENZA
const DOMINIO = "studenti.uniroma1.it";
const MATRICOLA_LEN = 7;
const PASSWORD_MIN = 8;
const EMAIL_REGEX = /^([a-z]+)\.(\d+)@studenti\.uniroma1\.it$/;
const MINUSCOLA_REGEX = /[a-z]/;
const MAIUSCOLA_REGEX = /[A-Z]/;
const SIMBOLO_REGEX = /[^A-Za-z0-9]/;
const NUMBER_REGEX = /[0-9]/;
const API_BASE_URL = "http://localhost:3000/api/facolta"



function normalizzaCognome(cognome) {
    return cognome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s'’\-]/g, "");
}

function validaRegistrazione({ nome, cognome, matricola, email, facolta, password, conferma }) {
    const errori = [];
    const campiInErrore = new Set();

    if (!nome.trim()) { errori.push("Il campo nome è obbligatorio."); campiInErrore.add("nome"); }
    if (!cognome.trim()) { errori.push("Il campo cognome è obbligatorio."); campiInErrore.add("cognome"); }
    if (!matricola.trim()) {
        errori.push("Il campo matricola è obbligatorio."); campiInErrore.add("matricola");
    } else if (!/^\d+$/.test(matricola)) {
        errori.push("La matricola deve contenere solo cifre numeriche."); campiInErrore.add("matricola");
    } else if (matricola.length !== MATRICOLA_LEN) {
        errori.push("La matricola deve essere di " + MATRICOLA_LEN + " cifre."); campiInErrore.add("matricola");
    }

    const emailLower = email.trim().toLowerCase();
    if (!emailLower) {
        errori.push("Il campo email è obbligatorio."); campiInErrore.add("email");
    } else {
        if (!emailLower.endsWith("@" + DOMINIO)) {
            errori.push("L'email deve appartenere al dominio " + DOMINIO); campiInErrore.add("email");
        }
        const match = emailLower.match(EMAIL_REGEX);
        if (!match) {
            errori.push("Il formato dell'email non è valido. Usa: cognome.matricola@studenti.uniroma1.it"); campiInErrore.add("email");
        } else {
            const [, cognomeEmail, matricolaEmail] = match;
            const cognomeAtteso = normalizzaCognome(cognome);
            if (cognomeAtteso && cognomeEmail !== cognomeAtteso) {
                errori.push("Il cognome nell'email non corrisponde a quello inserito."); campiInErrore.add("email");
            }
            if (matricola && matricolaEmail !== matricola.trim()) {
                errori.push("La matricola nell'email non corrisponde a quella inserita."); campiInErrore.add("email");
            }
        }
    }

    if (!facolta) {
        errori.push("Devi selezionare una facoltà."); campiInErrore.add("facolta");
    }

    if (!password) {
        errori.push("Il campo password è obbligatorio."); campiInErrore.add("password");
    } else {
        if (password.length < PASSWORD_MIN) { errori.push("La password deve essere di almeno " + PASSWORD_MIN + " caratteri."); campiInErrore.add("password"); }
        if (!MINUSCOLA_REGEX.test(password)) { errori.push("La password deve contenere almeno una lettera minuscola (a-z)."); campiInErrore.add("password"); }
        if (!MAIUSCOLA_REGEX.test(password)) { errori.push("La password deve contenere almeno una lettera maiuscola (A-Z)."); campiInErrore.add("password"); }
        if (!SIMBOLO_REGEX.test(password)) { errori.push("La password deve contenere almeno un simbolo."); campiInErrore.add("password"); }
        if (!NUMBER_REGEX.test(password)) { errori.push("La password deve contenere almeno un numero (0-9)."); campiInErrore.add("password"); }
    }

    if (!conferma) {
        errori.push("Il campo conferma password è obbligatorio."); campiInErrore.add("confermaPassword");
    } else if (password && password !== conferma) {
        errori.push("Le password non coincidono.");
        campiInErrore.add("confermaPassword");
        campiInErrore.add("password");
    }

    return { ok: errori.length === 0, errori, campiInErrore };
}

function EyeIcon() {
    return (
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-3.17 4.19" />
            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

const initialFormState = {
    nome: "", cognome: "", matricola: "", email: "", facolta: "", password: "", confermaPassword: "",
};

export default function RegistrazioneConFacolta() {
    const [formData, setFormData] = useState(initialFormState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConferma, setShowConferma] = useState(false);
    const [campiInErrore, setCampiInErrore] = useState(() => new Set());
    const [tuttiValidi, setTuttiValidi] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] });
    const [facolta, setFacolta] = useState([]);
    const navigate = useNavigate();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

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
        caricaFacolta()
    }, [])


    const caricaFacolta = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Errore nel caricamento dei corsi')

            const facolta = await response.json()
            console.log(facolta)

            setFacolta(facolta)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, errori, campiInErrore: nuoviErrori } = validaRegistrazione({ ...formData, conferma: formData.confermaPassword });

        if (ok) {
            setFeedback({ show: true, type: "ok", errori: [] });
            setTuttiValidi(true);
            setCampiInErrore(new Set());

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome,
                    cognome: formData.cognome,
                    matricola: formData.matricola,
                    email: formData.email,
                    facolta: formData.facolta,
                    password: formData.password,
                })
            });

            if (response.ok) {
                navigate("/login");
            } else {
                throw new Error("Impossibile completare l'ordine")
            }

        } else {
            setFeedback({ show: true, type: "error", errori });
            setCampiInErrore(nuoviErrori);
            setTuttiValidi(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setShowPassword(false);
        setShowConferma(false);
        setCampiInErrore(new Set());
        setTuttiValidi(false);
        setFeedback({ show: false, type: "", errori: [] });
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
                    <h1 className="text-center custom-title mb-1">Registrazione Studente</h1>
                    <p className="text-center text-muted fst-italic mb-4" style={{ fontSize: "0.875rem" }}>
                        Crea il tuo account con la mail istituzionale
                    </p>

                    <form id="registrationForm" onSubmit={handleSubmit} noValidate>
                        <div className="row">
                            <div className="mb-3">
                                <label htmlFor="nome" className="form-label custom-label">Nome</label>
                                <input type="text" id="nome" name="nome" required value={formData.nome} onChange={handleChange} className={`form-control ${classFor("nome")}`} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="cognome" className="form-label custom-label">Cognome</label>
                                <input type="text" id="cognome" name="cognome" required value={formData.cognome} onChange={handleChange} className={`form-control ${classFor("cognome")}`} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="matricola" className="form-label custom-label">Matricola</label>
                            <input type="text" id="matricola" name="matricola" inputMode="numeric" required value={formData.matricola} onChange={handleChange} className={`form-control ${classFor("matricola")}`} />
                            <div className="form-text">7 cifre numeriche</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label custom-label">Email istituzionale</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={`form-control ${classFor("email")}`} />
                            <div className="form-text">formato: cognome.matricola@studenti.uniroma1.it</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="facolta" className="form-label custom-label">Facoltà</label>
                            <select id="facolta" name="facolta" required value={formData.facolta} onChange={handleChange} className={`form-select ${classFor("facolta")}`}>
                                <option value="" disabled>- Seleziona la tua facoltà -</option>

                                {facolta.map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}


                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label custom-label">Password</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" required value={formData.password} onChange={handleChange} className={`form-control ${classFor("password")}`} />
                                <button className="btn btn-outline-secondary d-flex align-items-center" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <div className="form-text">Almeno 8 caratteri: una minuscola (a-z), una maiuscola (A-Z), un numero (0-9) e un simbolo (es. ?!@,.)</div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confermaPassword" className="form-label custom-label">Conferma password</label>
                            <div className="input-group">
                                <input type={showConferma ? "text" : "password"} id="confermaPassword" name="confermaPassword" required value={formData.confermaPassword} onChange={handleChange} className={`form-control ${classFor("confermaPassword")}`} />
                                <button className="btn btn-outline-secondary d-flex align-items-center" type="button" onClick={() => setShowConferma(!showConferma)}>
                                    {showConferma ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn-custom">Crea account</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Resetta il form</button>
                        </div>

                        {feedback.show && (
                            <div className={`alert mt-4 ${feedback.type === "ok" ? "alert-success" : "alert-danger"}`} role="alert">
                                {feedback.type === "ok" ? (
                                    "Account creato con successo. Benvenuto in AstraNote."
                                ) : (
                                    <>
                                        <strong className="d-block mb-2">Impossibile creare l'account:</strong>
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