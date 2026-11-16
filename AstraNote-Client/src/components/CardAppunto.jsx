import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../style/CardAppunto.css';
import Matita from "../assets/matita.svg";
import { useAuth } from "./AuthContext";
import ConfermaDialog from "./ConfermaDialog";

function stelleDaRecensioni(recensioni)
{
    if (!recensioni || recensioni.length === 0) return "☆".repeat(5);
    const somma = recensioni.reduce((acc, rec) => acc + rec.valutazione, 0);
    const media = Math.round(somma / recensioni.length);
    return "⭐".repeat(media) + "☆".repeat(5 - media);
}

export default function CardAppunto({ appunto, onSave, sectionActivate })
{
    const [stelle, setStelle] = useState("");
    const [bookMark, setBookMark] = useState(false);
    const [errore, setErrore] = useState("");
    const [recensioni, setRecensioni] = useState([]);
    const [caricamentoCard, setCaricamentoCard] = useState(true);
    const [confermaElimina, setConfermaElimina] = useState(false);

    const navigate = useNavigate();
    const { utente } = useAuth();
    const location = useLocation();
    const isLibreria = location.pathname === "/libreria";

    useEffect(() =>
    {
        fetchCard();
    }, [appunto.id]);

    const fetchCard = async () =>
    {
        try
        {
            setCaricamentoCard(true);
            const response = await fetch(`/api/appunti/${appunto.id}/dettagli`);
            if (!response.ok) throw new Error("Errore nel recupero dati");
            const { preferiti, recensioni } = await response.json();
            setBookMark(preferiti.some(p => String(p.user_id) === String(utente?.id)));
            setRecensioni(recensioni);
            setStelle(stelleDaRecensioni(recensioni));
        } catch (error)
        {
            setErrore(error.message);
        } finally
        {
            setCaricamentoCard(false);
        }
    };

    const saveCard = async () =>
    {
        const response = await fetch("/api/preferiti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appunto_id: appunto.id })
        });
        if (!response.ok) throw new Error("Errore nel salvataggio");
    };

    const deleteSavedCard = async () =>
    {
        const response = await fetch("/api/preferiti", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appunto_id: appunto.id })
        });
        if (!response.ok) throw new Error("Errore nella rimozione");
    };

    const togglePreferito = async (e) =>
    {
        e.stopPropagation();
        const stavaSalvato = bookMark;
        setBookMark(!stavaSalvato);
        try
        {
            if (stavaSalvato)
            {
                await deleteSavedCard();
                if (isLibreria)
                {
                    onSave?.({ tipo: "unsave", id: appunto.id });
                }
            }
            else
            {
                await saveCard();
                if (isLibreria)
                {
                    onSave?.({ tipo: "save", appunto });
                }
            }
        } catch
        {
            setBookMark(stavaSalvato);
            setErrore("Errore nell'aggiornare i preferiti");
        }
    };

    const apriAppunto = () =>
    {
        navigate(`/appunto/${appunto.id}`, { state: { from: location.pathname } });
    };

    const modificaAppunto = (e) =>
    {
        e.stopPropagation();
        navigate(`/modifica/${appunto.id}`);
    };

    const chiediElimina = (e) =>
    {
        e.stopPropagation();
        setConfermaElimina(true);
    };

    const confermaEliminazione = () =>
    {
        setConfermaElimina(false);
        onSave?.({ tipo: "delete", id: appunto.id });

        fetch(`/api/appunti/${appunto.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url_thumbnail: appunto.url_thumbnail, url_file: appunto.url_file })
        }).then((response) =>
        {
            if (!response.ok) throw new Error("Errore nell'eliminazione");
        }).catch(() =>
        {
            onSave?.({ tipo: "restore", appunto, errore: "Impossibile eliminare l'appunto. Riprova." });
        });
    };

    if (caricamentoCard)
    {
        return (
            <div className="col-lg-4 col-md-6 col-12">
                <div className="border rounded p-3 h-100 shadow-sm placeholder-glow">
                    <div className="d-flex gap-2">
                        <div className="placeholder col-4 rounded" style={{ height: "120px" }}></div>
                        <div className="col-8">
                            <div className="placeholder col-8 mb-2"></div>
                            <div className="placeholder col-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-lg-4 col-md-6 col-12 h-100">
            <div className="cardCnt" onClick={apriAppunto} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") apriAppunto(); }}>
                <div className="position-absolute top-0 end-0 m-2 d-flex flex-column align-items-center" style={{ zIndex: 1 }}>
                    <div className="bookmarkCnt" onClick={togglePreferito}>
                        <svg className="bookmarkImg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill={bookMark ? "currentColor" : "none"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>

                    {(isLibreria && sectionActivate === "caricati") && (
                        <>
                            <button type="button" className="cardActionBtn" title="Modifica" aria-label="Modifica appunto" onClick={modificaAppunto}>
                                <img className="pencilImg" src={Matita} alt="" />
                            </button>
                            <button type="button" className="cardActionBtn" title="Elimina" aria-label="Elimina appunto" onClick={chiediElimina}>
                                <svg className="trashImg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {errore && (
                    <div className="alert alert-danger position-fixed bottom-0 end-0 m-3" role="alert">
                        {errore}
                    </div>
                )}

                <div className="d-flex w-100 position-relative h-100">
                    <div className="col-4">
                        <img className="anteprima object-fit-cover rounded" src={appunto.url_thumbnail} alt="" />
                        <span className="anno">{appunto.anno_riferimento}</span>
                        <div className="recensioneCnt">
                            <span>{stelle}</span>
                            <span>({recensioni.length} recensioni)</span>
                        </div>
                    </div>

                    <div className="sezioneDestra d-flex flex-column position-relative ms-2 h-100 w-100 pe-3 overflow-hidden">
                        <div className="titoloAppunto">
                            <h5 className="text-break">{appunto.titolo}</h5>
                        </div>
                        <span>{appunto.corso?.facolta?.nome}</span>
                        <hr className="linea" />
                        <div className="dopoLinea">
                            <span>{appunto.corso?.nome}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfermaDialog
                aperto={confermaElimina}
                titolo="Eliminare l'appunto?"
                messaggio="Sei sicuro di voler eliminare questo appunto? L'operazione non si può annullare."
                confermaLabel="Elimina"
                annullaLabel="Annulla"
                onAnnulla={() => setConfermaElimina(false)}
                onConferma={confermaEliminazione}
            />
        </div>
    );
}
