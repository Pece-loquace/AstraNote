import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import eye from "../../assets/eye-line.svg"
import eyeoff from "../../assets/eye-off-line.svg"

// REGISTRAZIONE STUDENTE SAPIENZA
const DOMINIO = "studenti.uniroma1.it";
const MATRICOLA_LEN = 7;
const PASSWORD_MIN = 8;
const EMAIL_REGEX = /^([a-z]+)\.(\d{7})@studenti\.uniroma1\.it$/;
const MINUSCOLA_REGEX = /[a-z]/;
const MAIUSCOLA_REGEX = /[A-Z]/;
const SIMBOLO_REGEX = /[^A-Za-z0-9]/;
const NUMBER_REGEX = /[0-9]/;
const API_BASE_URL = "http://localhost:3000/api/facolta"


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
        <img src={eye} alt="Occhio aperto" width={18} height={18} />
    );
}

function EyeOffIcon() {
    return (
        <img src={eyeoff} alt="Occhio chiuso" width={18} height={18} />
    );
}

const initialFormState = {
    email: "", password: "",
};

export default function RegistrazioneConFacolta() {
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
            const data = await response.json();

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
                            {//<div className="form-text">formato: cognome.matricola@studenti.uniroma1.it</div>
                            }
                        </div>



                        <div className="mb-3">
                            <label htmlFor="password" className="form-label custom-label">Password</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" required value={formData.password} onChange={handleChange} className={`form-control ${classFor("password")}`} />
                                <button className="btn btn-outline-secondary d-flex align-items-center" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {//<div className="form-text">Almeno 8 caratteri: una minuscola (a-z), una maiuscola (A-Z), un numero (0-9) e un simbolo (es. ?!@,.)</div>
                            }
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn-custom">Login</button>
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



