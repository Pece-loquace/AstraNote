import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import "../../style/back_buttons.css";

// REGISTRAZIONE STUDENTE SAPIENZA
const DOMINIO = "studenti.uniroma1.it";
const MATRICOLA_LEN = 7;
const PASSWORD_MIN = 8;
const EMAIL_REGEX = /^([a-z]+)\.(\d{7})@studenti\.uniroma1\.it$/;
const MINUSCOLA_REGEX = /[a-z]/;
const MAIUSCOLA_REGEX = /[A-Z]/;
const SIMBOLO_REGEX = /[^A-Za-z0-9]/;
const NUMBER_REGEX = /[0-9]/;
const API_BASE_URL = "http://localhost:3000/api/facolta";

function validazioneLogin({ email, password }) {
    const errori = [];
    const campiInErrore = new Set();

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
        }
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

    return { ok: errori.length === 0, errori, campiInErrore };
}

function EyeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

const initialFormState = {
    email: "", password: "",
};

export default function RegistrazioneConFacolta({ setSection }) {
    const [formData, setFormData] = useState(initialFormState);
    const [showPassword, setShowPassword] = useState(false);
    const [campiInErrore, setCampiInErrore] = useState(() => new Set());
    const [tuttiValidi, setTuttiValidi] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, errori, campiInErrore: nuoviErrori } = validazioneLogin({ ...formData, conferma: formData.confermaPassword });

        if (ok) {
            setFeedback({ show: true, type: "ok", errori: [] });
            setTuttiValidi(true);
            setCampiInErrore(new Set());

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            });

            if (response.ok) {
                navigate("/homepage");
            } else {
                const error = await response.json();
                const errori = Array.isArray(error) ? error : [error.error || error.message || "Credenziali non valide"];

                setFeedback({ show: true, type: "error", errori: errori });
                setCampiInErrore(nuoviErrori);
                setTuttiValidi(false);
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
            <div className="card shadow-lg custom-card w-100" style={{ maxWidth: "520px" }}>
                <div className="card-body p-4 p-md-5 position-relative">
                    <div className="custom-border"></div>

                    <div className="text-center text-uppercase crest-text mb-2">Sapienza - Università di Roma</div>
                    <h1 className="text-center custom-title mb-1">Login Studente</h1>
                    <p className="text-center text-muted fst-italic mb-4" style={{ fontSize: "0.875rem" }}>
                        Accedi al tuo account con la mail istituzionale
                    </p>

                    <form id="registrationForm" onSubmit={handleSubmit} noValidate>


                        <div className="mb-3">
                            <label htmlFor="email" className="form-label custom-label">Email istituzionale</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={`form-control ${classFor("email")}`} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label custom-label">Password</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" required value={formData.password} onChange={handleChange} className={`form-control ${classFor("password")}`} />
                                <button className="btn btn-outline-secondary d-flex align-items-center" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn-custom">Login</button>
                            <button type="button" className="btn-back btn-outline-secondary" onClick={() => { setSection('frontpage'); handleReset(); }}>Indietro</button>
                        </div>

                        {feedback.show && (
                            <div className={`alert mt-4 ${feedback.type === "ok" ? "alert-success" : "alert-danger"}`} role="alert">
                                {feedback.type === "ok" ? (
                                    "Tutti i campi sono corretti, verifica in corso..."
                                ) : (
                                    <>
                                        <strong className="d-block mb-2">Impossibile accedere all'account:</strong>
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