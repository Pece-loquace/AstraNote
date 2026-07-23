import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../style/bootstrap.css"
import "../../style/buttons.css"
import "./Impostazioni.css"
import LoadingSpinner from "../../components/LoadingSpinner"

// MODIFICA PROFILO
const PASSWORD_MIN = 8
const MINUSCOLA_REGEX = /[a-z]/
const MAIUSCOLA_REGEX = /[A-Z]/
const SIMBOLO_REGEX = /[^A-Za-z0-9]/
const NUMBER_REGEX = /[0-9]/

function validaImpostazioni({ nome, facolta, password, nuovaPassword, confermaPassword }) {
    const errori = []
    const campiInErrore = new Set()

    if (!nome.trim()) {
        errori.push("Il campo nome è obbligatorio.")
        campiInErrore.add("nome")
    }

    if (!facolta) {
        errori.push("Devi selezionare una facoltà.")
        campiInErrore.add("facolta")
    }

    if (!password) {
        errori.push("Devi inserire la password attuale per confermare le modifiche.")
        campiInErrore.add("password")
    }

    if (nuovaPassword) {
        if (nuovaPassword.length < PASSWORD_MIN) {
            errori.push("La nuova password deve essere di almeno " + PASSWORD_MIN + " caratteri.")
            campiInErrore.add("nuovaPassword")
        }
        if (!MINUSCOLA_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno una lettera minuscola (a-z).")
            campiInErrore.add("nuovaPassword")
        }
        if (!MAIUSCOLA_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno una lettera maiuscola (A-Z).")
            campiInErrore.add("nuovaPassword")
        }
        if (!NUMBER_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno un numero (0-9).")
            campiInErrore.add("nuovaPassword")
        }
        if (!SIMBOLO_REGEX.test(nuovaPassword)) {
            errori.push("La nuova password deve contenere almeno un simbolo.")
            campiInErrore.add("nuovaPassword")
        }
        if (nuovaPassword !== confermaPassword) {
            errori.push("La nuova password e la conferma non coincidono.")
            campiInErrore.add("nuovaPassword")
            campiInErrore.add("confermaPassword")
        }
    } else if (confermaPassword) {
        errori.push("Inserisci anche la nuova password.")
        campiInErrore.add("nuovaPassword")
    }

    return { ok: errori.length === 0, errori, campiInErrore }
}

function EyeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    )
}

export default function Impostazioni() {
    const navigate = useNavigate()

    const [utente, setUtente] = useState(null)
    const [listaFacolta, setListaFacolta] = useState([])
    const [caricamento, setCaricamento] = useState(true)
    const [salvataggio, setSalvataggio] = useState(false)

    const [feedback, setFeedback] = useState({ show: false, type: "", errori: [] })
    const [campiInErrore, setCampiInErrore] = useState(new Set())
    const [tuttiValidi, setTuttiValidi] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showNuovaPassword, setShowNuovaPassword] = useState(false)
    const [showConfermaPassword, setShowConfermaPassword] = useState(false)

    const [form, setForm] = useState({
        nome: "",
        cognome: "",
        matricola: "",
        facolta: "",
        password: "",
        nuovaPassword: "",
        confermaPassword: "",
    })

    useEffect(() => {
        const fetchDati = async () => {
            try {
                setCaricamento(true)

                const resUser = await fetch("/api/utente_loggato")
                if (!resUser.ok) throw new Error("Errore nel reperire l'utente loggato")
                const user = await resUser.json()
                setUtente(user)

                const resFacoltaLista = await fetch("/api/facolta")
                if (!resFacoltaLista.ok) throw new Error("Errore nel reperire le facoltà")
                const facolta = await resFacoltaLista.json()
                setListaFacolta(facolta)

                setForm((statoPrecendete) => ({
                    ...statoPrecendete,
                    nome: user.nome || "",
                    cognome: user.cognome || "",
                    matricola: user.matricola || "",
                    facolta: user.facolta || "",
                }))
            } catch (err) {
                console.error(err)
                setFeedback({ show: true, type: "error", errori: [err.message] })
            } finally {
                setCaricamento(false)
            }
        }

        fetchDati()
    }, [])

    const setField = (key, value) => {
        setForm((statoPrecendete) => ({ ...statoPrecendete, [key]: value }))

        setCampiInErrore((prev) => {
            if (!prev.has(key)) return prev
            const next = new Set(prev)
            next.delete(key)
            return next
        })
        setTuttiValidi(false)
        setFeedback((prev) => (prev.show ? { ...prev, show: false } : prev))
    }

    const classFor = (field) => {
        if (campiInErrore.has(field)) return "is-invalid"
        if (tuttiValidi) return "is-valid"
        return ""
    }

    const handleSubmit = async (evento) => {
        evento.preventDefault()

        const { ok, errori, campiInErrore: nuoviErrori } = validaImpostazioni(form)

        if (!ok) {
            setFeedback({ show: true, type: "error", errori })
            setCampiInErrore(nuoviErrori)
            setTuttiValidi(false)
            return
        }

        try {
            setSalvataggio(true)
            setFeedback({ show: true, type: "ok", errori: [] })
            setCampiInErrore(new Set())
            setTuttiValidi(true)

            const payload = {
                nome: form.nome,
                facolta: form.facolta,
                passwordAttuale: form.password,
            }
            if (form.nuovaPassword) payload.nuovaPassword = form.nuovaPassword

            const risposta = await fetch(`/api/utenti/${utente.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            
            if (risposta.ok) {
                setFeedback({ show: true, type: "ok", errori: [] })
                setTimeout(() => navigate(`/utente/${utente.id}`), 1000)
            } else {
                const error = await risposta.json().catch(() => ({}))
                const erroriBackend = Array.isArray(error)
                    ? error
                    : [error.error || error.message || "Errore durante il salvataggio del profilo"]

                setFeedback({ show: true, type: "error", errori: erroriBackend })
                setCampiInErrore(new Set())
                setTuttiValidi(false)
            }
        } catch (err) {
            console.error(err)
            setFeedback({ show: true, type: "error", errori: [err.message] })
            setTuttiValidi(false)
        } finally {
            setSalvataggio(false)
        }
    }

    if (caricamento) {
        return <LoadingSpinner />
    }

    if (feedback.show && feedback.type === "error" && !utente) {
        return (
            <div className="container py-5 text-center text-danger">
                Errore: {feedback.errori.join(", ")}
            </div>
        )
    }

    return (
        <main className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
            <div className="card shadow-lg w-100" style={{ maxWidth: "850px" }}>
                <div className="card-body p-4 p-md-5 position-relative">
                    <div className="custom-border"></div>

                    <h1 className="text-center custom-title mb-1">Modifica profilo</h1>
                    <p className="text-center text-muted fst-italic mb-4" style={{ fontSize: "0.875rem" }}>
                        Aggiorna i tuoi dati personali
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row g-3">
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="nome" className="form-label custom-label">Nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    className={`form-control ${classFor("nome")}`}
                                    value={form.nome}
                                    onChange={(evento) => setField("nome", evento.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-sm-6  mb-3">
                                <label htmlFor="cognome" className="form-label custom-label">Cognome</label>
                                <input
                                    id="cognome"
                                    type="text"
                                    className="form-control"
                                    value={form.cognome}
                                    onChange={(evento) => setField("cognome", evento.target.value)}
                                    disabled
                                />
                                <div className="form-text">Il cognome non è modificabile</div>
                            </div>

                            <div className="col-sm-6 mb-3">
                                <label htmlFor="matricola" className="form-label custom-label">Matricola</label>
                                <input
                                    id="matricola"
                                    type="text"
                                    className="form-control"
                                    value={form.matricola}
                                    onChange={(evento) => setField("matricola", evento.target.value)}
                                    disabled
                                />
                                <div className="form-text">La matricola non è modificabile</div>
                            </div>

                            <div className="col-sm-6 mb-3">
                                <label htmlFor="facolta" className="form-label custom-label">Facoltà</label>
                                <select
                                    id="facolta"
                                    className={`form-select ${classFor("facolta")}`}
                                    value={form.facolta}
                                    onChange={(evento) => setField("facolta", evento.target.value)}
                                    required
                                >
                                    <option value="" disabled>- Seleziona una facoltà -</option>
                                    {listaFacolta.map((facoltà) => (
                                        <option key={facoltà.id} value={facoltà.id}>
                                            {facoltà.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label custom-label">Password</label>
                                <div className="input-group">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control ${classFor("password")}`}
                                        value={form.password}
                                        onChange={(evento) => setField("password", evento.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        className="btn btn-outline-secondary d-flex align-items-center"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <div className="form-text">
                                    Inserisci la tua password attuale per confermare le modifiche
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="nuovaPassword" className="form-label custom-label">Nuova Password</label>
                                <div className="input-group">
                                    <input
                                        id="nuovaPassword"
                                        type={showNuovaPassword ? "text" : "password"}
                                        className={`form-control ${classFor("nuovaPassword")}`}
                                        value={form.nuovaPassword}
                                        onChange={(evento) => setField("nuovaPassword", evento.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        className="btn btn-outline-secondary d-flex align-items-center"
                                        type="button"
                                        onClick={() => setShowNuovaPassword(!showNuovaPassword)}
                                    >
                                        {showNuovaPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <div className="form-text">
                                    Lascia vuoto se non vuoi cambiarla. Almeno 8 caratteri: una minuscola, una maiuscola, un numero e un simbolo.
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confermaPassword" className="form-label custom-label">Conferma Password</label>
                                <div className="input-group">
                                    <input
                                        id="confermaPassword"
                                        type={showConfermaPassword ? "text" : "password"}
                                        className={`form-control ${classFor("confermaPassword")}`}
                                        value={form.confermaPassword}
                                        onChange={(evento) => setField("confermaPassword", evento.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        className="btn btn-outline-secondary d-flex align-items-center"
                                        type="button"
                                        onClick={() => setShowConfermaPassword(!showConfermaPassword)}
                                    >
                                        {showConfermaPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <div className="form-text">Ripeti la nuova password</div>
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="carica btn-custom"
                                disabled={salvataggio}
                            >
                                {salvataggio ? "Salvataggio…" : "Salva modifiche"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Annulla
                            </button>
                        </div>

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
                    </form>
                </div>
            </div>
        </main>
    )
}