import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../style/QuizAppunto.css";

const lettere = ["A", "B", "C", "D"];

function chiaveRisposte(quizId)
{
    return `astranote-quiz-${quizId}`;
}

function normalizzaDomande(raw)
{
    const lista = typeof raw === "string" ? JSON.parse(raw) : (raw || []);
    return lista.map((d) => ({
        testo: d.question_text || d.testo || d.domanda || "",
        opzioni: d.options || d.opzioni || [],
        corretta: d.correct_answer ?? d.corretta ?? "",
        spiegazione: d.explanation || d.spiegazione || ""
    }));
}

function opzioneEsatta(domanda, scelta)
{
    if (scelta == null || scelta === "") return false;
    const corretta = String(domanda.corretta ?? "").trim();
    const sceltaStr = String(scelta).trim();
    if (sceltaStr.toLowerCase() === corretta.toLowerCase()) return true;

    const indiceLettera = lettere.indexOf(corretta.toUpperCase());
    if (indiceLettera >= 0 && domanda.opzioni[indiceLettera] === scelta) return true;

    const indiceNumero = Number(corretta);
    if (!Number.isNaN(indiceNumero) && domanda.opzioni[indiceNumero] === scelta) return true;

    return false;
}

export default function QuizAppunto()
{
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const tornaIndietro = () =>
    {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());

        const precedente = location.state?.from;
        if (precedente && precedente !== location.pathname)
        {
            navigate(precedente);
            return;
        }
        navigate("/homepage");
    };

    const [quiz, setQuiz] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState("");
    const [indice, setIndice] = useState(0);
    const [scelte, setScelte] = useState([]);
    const [mostraRisultato, setMostraRisultato] = useState(false);

    const domande = useMemo(() => normalizzaDomande(quiz?.domande), [quiz]);

    useEffect(() =>
    {
        const carica = async () =>
        {
            try
            {
                const res = await fetch(`/api/quiz/${quizId}`);
                if (!res.ok) throw new Error("Impossibile caricare il quiz");
                const data = await res.json();
                const lista = normalizzaDomande(data.domande);
                const salvate = JSON.parse(localStorage.getItem(chiaveRisposte(quizId)) || "null");
                const iniziali = Array.isArray(salvate) && salvate.length === lista.length
                    ? salvate
                    : Array(lista.length).fill(null);

                setQuiz(data);
                setScelte(iniziali);

                const primaVuota = iniziali.findIndex(s => s == null);
                const tutteRisposte = primaVuota === -1 && lista.length > 0;
                setMostraRisultato(tutteRisposte);
                setIndice(tutteRisposte ? 0 : (primaVuota === -1 ? 0 : primaVuota));
            } catch (e)
            {
                setErrore(e.message);
            } finally
            {
                setCaricamento(false);
            }
        };
        carica();
    }, [quizId]);

    const salvaProgresso = async (nuoveScelte) =>
    {
        localStorage.setItem(chiaveRisposte(quizId), JSON.stringify(nuoveScelte));
        const risposte = nuoveScelte.filter(s => s != null).length;
        const corrette = nuoveScelte.reduce((n, s, i) => n + (opzioneEsatta(domande[i], s) ? 1 : 0), 0);
        try
        {
            await fetch(`/api/quiz/${quizId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ risposte, corrette })
            });
        } catch
        {
            /* il punteggio resta comunque visibile in locale */
        }
    };

    const rispondi = (opzione) =>
    {
        if (scelte[indice] != null) return;
        const nuove = [...scelte];
        nuove[indice] = opzione;
        setScelte(nuove);
        salvaProgresso(nuove);
        if (nuove.every(s => s != null)) setMostraRisultato(false);
    };

    if (caricamento)
    {
        return (
            <div className="qz-page">
                <div className="qz-main">
                    <div className="qz-empty">Caricamento quiz...</div>
                </div>
            </div>
        );
    }

    if (errore || !quiz)
    {
        return (
            <div className="qz-page">
                <div className="qz-main">
                    <button className="qz-back" type="button" onClick={tornaIndietro}>← Indietro</button>
                    <div className="qz-error" role="alert">{errore || "Quiz non trovato"}</div>
                </div>
            </div>
        );
    }

    const corrette = scelte.reduce((n, s, i) => n + (opzioneEsatta(domande[i], s) ? 1 : 0), 0);
    const risposteDate = scelte.filter(s => s != null).length;
    const domanda = domande[indice];
    const scelta = scelte[indice];
    const perc = domande.length ? (risposteDate / domande.length) * 100 : 0;

    return (
        <div className="qz-page">
            <div className="qz-main">
                <button className="qz-back" type="button" onClick={tornaIndietro}>← Indietro</button>
                <div className="qz-kicker">Quiz · appunto</div>
                <h1 className="qz-title">{quiz.titolo}</h1>
                <p className="qz-hint">Scegli una risposta per ogni domanda. Puoi tornare indietro e rivedere quelle già date.</p>

                <div className="qz-chips">
                    {domande.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`qz-chip${i === indice ? " on" : ""}`}
                            onClick={() => { setMostraRisultato(false); setIndice(i); }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {mostraRisultato ? (
                    <div className="qz-card">
                        <div className="qz-result">
                            <div className="big">{corrette}/{domande.length}</div>
                            <p>Risposte corrette</p>
                            <button type="button" className="qz-btn main" onClick={() => { setMostraRisultato(false); setIndice(0); }}>
                                Rivedi le domande
                            </button>
                        </div>
                    </div>
                ) : domanda ? (
                    <>
                        <div className="qz-progress">
                            <b>{indice + 1}</b> / {domande.length}
                            <div className="qz-bar"><i style={{ width: `${perc}%` }} /></div>
                        </div>

                        <div className="qz-card">
                            <div className="qz-row">
                                <span>Domanda {indice + 1}</span>
                                <span>{scelta != null ? "Risposta data" : "In attesa"}</span>
                            </div>
                            <div className="qz-label">Quesito</div>
                            <p className="qz-q">{domanda.testo}</p>

                            {domanda.opzioni.map((opzione, i) =>
                            {
                                const data = scelta != null;
                                const esatta = opzioneEsatta(domanda, opzione);
                                const sceltaQuesta = scelta === opzione;
                                let cls = "qz-opt";
                                if (data && esatta) cls += " right";
                                else if (data && sceltaQuesta && !esatta) cls += " wrong";
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        className={cls}
                                        disabled={data}
                                        onClick={() => rispondi(opzione)}
                                    >
                                        <span className="l">{lettere[i] || i + 1}</span>
                                        <span>{opzione}</span>
                                    </button>
                                );
                            })}

                            {scelta != null && domanda.spiegazione && (
                                <div className="qz-expl">{domanda.spiegazione}</div>
                            )}
                        </div>

                        <div className="qz-nav">
                            <button type="button" className="qz-btn" disabled={indice === 0} onClick={() => setIndice(i => i - 1)}>
                                Precedente
                            </button>
                            {indice < domande.length - 1 ? (
                                <button type="button" className="qz-btn main" onClick={() => setIndice(i => i + 1)}>
                                    Successiva
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="qz-btn main"
                                    disabled={risposteDate < domande.length}
                                    onClick={() => setMostraRisultato(true)}
                                >
                                    Vedi risultato
                                </button>
                            )}
                        </div>
                    </>
                ) : null}

                <div className="qz-foot">
                    <span>Corrette: <span className="ok">{corrette}</span></span>
                    <span>Errate: <span className="ko">{risposteDate - corrette}</span></span>
                    <span>Risposte: {risposteDate} / {domande.length}</span>
                </div>
            </div>
        </div>
    );
}
