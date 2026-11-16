import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./PaginaQuiz.css";

export default function PaginaQuiz()
{
    const navigate = useNavigate();
    const [righe, setRighe] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState("");
    const [generando, setGenerando] = useState(null);

    useEffect(() =>
    {
        carica();
    }, []);

    const carica = async () =>
    {
        try
        {
            setCaricamento(true);
            const res = await fetch("/api/quiz/miei");
            if (!res.ok) throw new Error("Impossibile caricare i quiz");
            setRighe(await res.json());
        } catch (e)
        {
            setErrore(e.message);
        } finally
        {
            setCaricamento(false);
        }
    };

    const genera = async (appuntoId) =>
    {
        setErrore("");
        setGenerando(appuntoId);
        try
        {
            const res = await fetch(`/api/appunti/${appuntoId}/quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero: 10 })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.errore || "Errore nella creazione del quiz");
            navigate(`/quiz/${appuntoId}/${data.id}`, { state: { from: "/quiz" } });
        } catch (e)
        {
            setErrore(e.message);
            setGenerando(null);
        }
    };

    if (caricamento) return <LoadingSpinner />;

    return (
        <div className="pq-page">
            <div className="container py-4 py-md-5">
                <p className="pq-kicker">Area personale</p>
                <h1 className="pq-title">I miei quiz</h1>
                <p className="pq-hint">Appunti per cui hai già creato almeno un quiz.</p>

                {errore && <div className="alert alert-danger">{errore}</div>}

                {righe.length === 0 ? (
                    <div className="pq-empty">Non hai ancora svolto nessun quiz.</div>
                ) : (
                    <div className="pq-list">
                        {righe.map(({ appunto, numeroQuiz }) => (
                            <div className="pq-row" key={appunto.id}>
                                <img className="pq-thumb" src={appunto.url_thumbnail} alt="" />
                                <div className="pq-info">
                                    <h2>{appunto.titolo}</h2>
                                    <p>{appunto.corso?.facolta?.nome}{appunto.corso?.nome ? ` · ${appunto.corso.nome}` : ""}</p>
                                </div>
                                <div className="pq-actions">
                                    <button
                                        type="button"
                                        className="pq-btn"
                                        onClick={() => navigate(`/appunto/${appunto.id}`, { state: { from: "/quiz", tab: "quiz" } })}
                                    >
                                        Quiz svolti ({numeroQuiz})
                                    </button>
                                    <button
                                        type="button"
                                        className="pq-btn pq-btn-main"
                                        disabled={generando === appunto.id}
                                        onClick={() => genera(appunto.id)}
                                    >
                                        {generando === appunto.id ? "Creazione..." : "Genera nuovo quiz"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
