import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StelleValutazioni from "../../components/StelleValutazioni";
import Segnala from "../../components/Segnala";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../components/AuthContext";
import profile from "../../assets/profile-circle.svg";
import "../../style/QuizAppunto.css";
import "./PaginaAppunto.css";

function stelleDaRecensioni(recensioni)
{
    if (!recensioni || recensioni.length === 0) return "☆".repeat(5);
    const somma = recensioni.reduce((acc, rec) => acc + rec.valutazione, 0);
    const media = Math.round(somma / recensioni.length);
    return "⭐".repeat(media) + "☆".repeat(5 - media);
}

export default function PaginaAppunto()
{
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { utente } = useAuth();

    const [appunto, setAppunto] = useState(null);
    const [autore, setAutore] = useState(null);
    const [recensioni, setRecensioni] = useState([]);
    const [stelle, setStelle] = useState("");
    const [valutazioneUtente, setValutazioneUtente] = useState(0);
    const [bookMark, setBookMark] = useState(false);
    const [quiz, setQuiz] = useState([]);
    const [tab, setTab] = useState(location.state?.tab === "quiz" ? "quiz" : "dettagli");
    const [caricamento, setCaricamento] = useState(true);
    const [caricamentoQuiz, setCaricamentoQuiz] = useState(false);
    const [generazione, setGenerazione] = useState(false);
    const [numero, setNumero] = useState(10);
    const [errore, setErrore] = useState("");
    const [erroreQuiz, setErroreQuiz] = useState("");
    const [showSegnala, setShowSegnala] = useState(false);

    const isAutore = String(utente?.id) === String(appunto?.id_autore);

    useEffect(() =>
    {
        carica();
    }, [id]);

    useEffect(() =>
    {
        if (tab === "quiz") caricaQuiz();
    }, [tab, id]);

    const carica = async () =>
    {
        try
        {
            setCaricamento(true);
            const [resAppunto, resDettagli] = await Promise.all([
                fetch(`/api/appunti/${id}`),
                fetch(`/api/appunti/${id}/dettagli`)
            ]);
            if (!resAppunto.ok || !resDettagli.ok) throw new Error("Impossibile caricare l'appunto");
            const dataAppunto = await resAppunto.json();
            const { preferiti, recensioni, autore } = await resDettagli.json();
            setAppunto(dataAppunto);
            setAutore(autore);
            setRecensioni(recensioni);
            setStelle(stelleDaRecensioni(recensioni));
            setBookMark(preferiti.some(p => String(p.user_id) === String(utente?.id)));
            const mia = recensioni.find(r => String(r.utente_valutante) === String(utente?.id));
            setValutazioneUtente(mia ? mia.valutazione : 0);
        } catch (e)
        {
            setErrore(e.message);
        } finally
        {
            setCaricamento(false);
        }
    };

    const caricaQuiz = async () =>
    {
        try
        {
            setCaricamentoQuiz(true);
            setErroreQuiz("");
            const res = await fetch(`/api/appunti/${id}/quiz`);
            if (!res.ok) throw new Error("Impossibile caricare i quiz");
            const data = await res.json();
            setQuiz(data.quiz || []);
        } catch (e)
        {
            setErroreQuiz(e.message);
        } finally
        {
            setCaricamentoQuiz(false);
        }
    };

    const tornaIndietro = () =>
    {
        const precedente = location.state?.from;
        if (precedente && precedente !== location.pathname) navigate(precedente);
        else navigate("/homepage");
    };

    const changeRecensioni = async (valore) =>
    {
        try
        {
            let recensioniAggiornate;
            if (valutazioneUtente === 0)
            {
                const response = await fetch("/api/recensioni", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stelle: valore, appunto_id: id })
                });
                if (!response.ok) throw new Error("Errore nel creare la recensione");
                recensioniAggiornate = [...recensioni, { valutazione: valore, utente_valutante: utente.id }];
            }
            else
            {
                const response = await fetch("/api/recensioni", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stelle: valore, appunto_id: id })
                });
                if (!response.ok) throw new Error("Errore nel modificare la recensione");
                recensioniAggiornate = recensioni.map(r =>
                    String(r.utente_valutante) === String(utente?.id) ? { ...r, valutazione: valore } : r
                );
            }

            setRecensioni(recensioniAggiornate);
            setStelle(stelleDaRecensioni(recensioniAggiornate));
            setValutazioneUtente(valore);

            const somma = recensioniAggiornate.reduce((acc, rec) => acc + rec.valutazione, 0);
            await fetch(`/api/appunti/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valutazione: Math.round(somma / recensioniAggiornate.length) })
            });
            window.dispatchEvent(new CustomEvent("astranote:rating-changed"));
        } catch (e)
        {
            alert(e.message);
        }
    };

    const togglePreferito = async () =>
    {
        try
        {
            const response = await fetch("/api/preferiti", {
                method: bookMark ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appunto_id: id })
            });
            if (!response.ok) throw new Error("Errore nei preferiti");
            setBookMark(!bookMark);
        } catch (e)
        {
            alert(e.message);
        }
    };

    const creaQuiz = async () =>
    {
        setErroreQuiz("");
        setGenerazione(true);
        try
        {
            const res = await fetch(`/api/appunti/${id}/quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.errore || "Errore nella creazione del quiz");
            navigate(`/quiz/${id}/${data.id}`, { state: { from: location.pathname } });
        } catch (e)
        {
            setErroreQuiz(e.message);
            setGenerazione(false);
        }
    };

    const eliminaQuiz = async (quizId) =>
    {
        if (!window.confirm("Eliminare questo quiz?")) return;
        try
        {
            const res = await fetch(`/api/quiz/${quizId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore nell'eliminazione");
            setQuiz(prev => prev.filter(q => q.id !== quizId));
        } catch (e)
        {
            setErroreQuiz(e.message);
        }
    };

    if (caricamento) return <LoadingSpinner />;

    if (errore || !appunto)
    {
        return (
            <div className="pa-page">
                <div className="container py-5">
                    <button type="button" className="pa-back" onClick={tornaIndietro}>← Indietro</button>
                    <div className="alert alert-danger">{errore || "Appunto non trovato"}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="pa-page">
            <div className="container py-4 py-md-5">
                <button type="button" className="pa-back" onClick={tornaIndietro}>← Indietro</button>

                <div className="pa-card position-relative">
                    <div className="pa-border" />
                    <div className="row g-4">
                        <div className="col-12 col-md-4 text-center">
                            <img className="pa-thumb" src={appunto.url_thumbnail} alt="" />
                            <p className="pa-meta mt-3 mb-1">Caricato il {new Date(appunto.data_creazione).toLocaleDateString("it-IT")}</p>
                            <p className="pa-meta">Anno {appunto.anno_riferimento}</p>
                            {autore && (
                                <Link className="pa-autore" to={`/utente/${autore.id}`}>
                                    <img src={profile} alt="" />
                                    <span>{autore.nome} {autore.cognome}</span>
                                </Link>
                            )}
                        </div>

                        <div className="col-12 col-md-8">
                            <p className="pa-kicker">{appunto.corso?.facolta?.nome} · {appunto.corso?.nome}</p>
                            <h1 className="pa-title">{appunto.titolo}</h1>
                            <p className="pa-stars">{stelle} ({recensioni.length === 1 ? "1 recensione" : `${recensioni.length} recensioni`})</p>
                            <p className="pa-desc"><strong>Descrizione:</strong> {appunto.descrizione || "Nessuna descrizione"}</p>

                            <div className="mb-3">
                                <div className="pa-label">La tua recensione</div>
                                <StelleValutazioni stelleAttuali={valutazioneUtente} onChange={changeRecensioni} />
                            </div>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <button type="button" className="pa-btn pa-btn-main" onClick={() => window.open(appunto.url_file, "_blank")}>
                                    Visualizza
                                </button>
                                <a className="pa-btn" href={`${appunto.url_file}?download=`}>Scarica</a>
                                <button type="button" className="pa-btn" onClick={togglePreferito}>
                                    {bookMark ? "Rimuovi dai salvati" : "Salva in libreria"}
                                </button>
                                <button type="button" className={`pa-btn ${tab === "quiz" ? "pa-btn-main" : ""}`} onClick={() => setTab("quiz")}>
                                    Quiz
                                </button>
                            </div>

                            {!isAutore && (
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="pa-btn pa-btn-warn" onClick={() => setShowSegnala(true)}>Segnala</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {tab === "quiz" && (
                    <div className="pa-card mt-4">
                        <div className="pa-kicker">Quiz · {appunto.titolo}</div>
                        <h2 className="pa-subtitle">I miei quiz</h2>
                        <p className="pa-hint">Crea un quiz da questo appunto o riprendi uno già iniziato.</p>

                        {erroreQuiz && <div className="qz-error" role="alert">{erroreQuiz}</div>}

                        <div className="qz-create">
                            <label>
                                Domande
                                <select value={numero} onChange={e => setNumero(Number(e.target.value))} disabled={generazione}>
                                    {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </label>
                            <button type="button" className="qz-btn main" onClick={creaQuiz} disabled={generazione}>
                                {generazione ? "Creazione in corso..." : "+ Crea quiz"}
                            </button>
                            {generazione && (
                                <div className="qz-status">
                                    <span className="qz-spinner" />
                                    L'IA sta leggendo il PDF e scrivendo le domande
                                </div>
                            )}
                        </div>

                        {caricamentoQuiz ? (
                            <div className="qz-empty">Caricamento quiz...</div>
                        ) : quiz.length === 0 ? (
                            <div className="qz-empty">Non hai ancora creato nessun quiz per questo appunto.</div>
                        ) : (
                            <div className="qz-list">
                                {quiz.map(q =>
                                {
                                    const perc = q.totale ? (q.risposte / q.totale) * 100 : 0;
                                    return (
                                        <div className="qz-item" key={q.id}>
                                            <h3>{q.titolo}</h3>
                                            <div className="qz-meta">
                                                Creato il {new Date(q.creato_il).toLocaleDateString("it-IT")} · {q.totale} domande
                                            </div>
                                            <div className="qz-score">
                                                <span>Corrette: <b style={{ color: "var(--ok)" }}>{q.corrette}</b></span>
                                                <span>Risposte: {q.risposte} / {q.totale}</span>
                                            </div>
                                            <div className="qz-bar"><i style={{ width: `${perc}%` }} /></div>
                                            <div className="qz-actions">
                                                <button type="button" className="qz-btn main" onClick={() => navigate(`/quiz/${id}/${q.id}`, { state: { from: location.pathname } })}>
                                                    {q.risposte === 0 ? "Inizia" : q.risposte < q.totale ? "Continua" : "Rivedi"}
                                                </button>
                                                <button type="button" className="qz-btn" onClick={() => eliminaQuiz(q.id)}>Elimina</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {showSegnala && <Segnala appuntoId={id} onClose={() => setShowSegnala(false)} />}
            </div>
        </div>
    );
}
