import { useState } from "react";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Segnala from "./Segnala";
import PdfDocumentViewer from "./PdfDocumentViewer";
import BookMark from "../assets/bookMark.png"
import BookMarkSelected from "../assets/bookmarkSelected.png"
import '../style/CardAppunto.css'
import StelleValutazioni from "./StelleValutazioni";


export default function CardAppunto({ appunto, onSave , sectionActivate, onModifica}) {
    const [stelle, setStelle] = useState("");
    const [loading, setLoading] = useState(false);
    const [utente, setUtente] = useState([])
    const[autore,setAutore] = useState([])
    const [showSegnala, setShowSegnala] = useState(false);
    const [bookMark, setBookMark] = useState(false)
    const [errore, setErrore] = useState(false)

    const [valutazioneUtente, setValutazioneUtente] = useState(0)

    const [numSalvato, setNumSalvato] = useState(0);
    const [recensioni, setRecensioni] = useState([]);
    const [showPdfViewer, setShowPdfViewer] = useState(false);

    /*Controlla se l'URL corrente è libreria */
    const location = useLocation();
    const isLibreria = location.pathname === "/libreria";

    useEffect(() => {
        fetchCard()
    }, [])

    const fetchCard = async () => {
        const appuntoId = appunto.id;
        try {
            const [res1, res2, res3, res4] = await Promise.all([
                fetch(`/api/appunti/${appuntoId}/preferiti`),
                fetch(`/api/recensioni/${appuntoId}`),
                fetch(`/api/utenti/${appunto.id_autore}`),   /*Per caricare nome e cognome dell'utente*/
                fetch('/api/me')
            ])

            if (!res1.ok || !res2.ok || !res3.ok || !res4.ok) {
                throw new Error("Errore nel recupero dati");
            }

            const [preferiti, recensioni, autore, utente] = await Promise.all([res1.json(), res2.json(), res3.json(), res4.json()])
            setAutore(autore);
            /*Setta l'utente */
            setUtente(utente);
            /*Setta il numero di volte che è stato salvato */
            setNumSalvato(preferiti.length)
            /* Controllo se l'utente corrente ha salvato l'appunto*/
            const isPresente = preferiti.some(p => String(p.user_id) === String(utente.id));
            setBookMark(isPresente);

            setRecensioni(recensioni);

            /*Setta le stelle */
            if (recensioni.length == 0) {
                setStelle("☆".repeat(5))
            } else {
                const somma = recensioni.reduce((acc, rec) => acc + rec.valutazione, 0);
                const media = somma / recensioni.length;
                const valutazioneMedia = Math.round(media);
                const stringaStelle = "⭐".repeat(valutazioneMedia) + "☆".repeat(5 - valutazioneMedia);
                setStelle(stringaStelle)
            }

            const recensioneUtente = recensioni.find(r => r.utente_valutante === utente.id);
            setValutazioneUtente(recensioneUtente ? recensioneUtente.valutazione : 0);

        } catch (error) {
            alert(error.message)
        }
    }

    const saveCard = async () => {
        console.log("Aggiungo l'appunto")
        try {
            const response = await fetch("/api/preferiti", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appunto_id: appunto.id })
            })
            if (!response.ok) throw new Error("Errore nel recupero dati");

            console.log("Appunto aggiunto")
        } catch (error) {
            setErrore("Errore nel salvare la card")
            console.log(error)
        } finally {
            setLoading(false);
        }
    }


    const deleteSavedCard = async () => {
        console.log("elimina")
        try {
            const response = await fetch('/api/preferiti', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appunto_id: appunto.id })
            })
            if (!response.ok) throw new Error("Errore nel recupero dati");
            console.log("Appunto eliminato con successo")
        } catch (error) {
            setErrore("Errore nell'eliminare il salvataggio")
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const ricalcolaStelle = (recensioniAggiornate) => {
        if (recensioniAggiornate.length === 0) {
            setStelle("☆".repeat(5));
        } else {
            const somma = recensioniAggiornate.reduce((acc, curr) => acc + curr.valutazione, 0);
            const media = Math.round(somma / recensioniAggiornate.length);
            setStelle("⭐".repeat(media) + "☆".repeat(5 - media));
        }
    };


    const changeRecensioni = async (stelle) => {
        console.log("Cambiando la recensione")
        try {
            let response;
            let recensioniAggiornate = [];
            if (valutazioneUtente === 0) {
                console.log("La creo una")
                response = await fetch('/api/recensioni', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stelle, appunto_id: appunto.id })
                });
                if (!response.ok) throw new Error("Errore nel creare la recensione");

                recensioniAggiornate = [...recensioni, { valutazione: stelle, utente_valutante: utente.id }];
            } else {
                console.log("La modifico una")
                response = await fetch('/api/recensioni', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stelle, appunto_id: appunto.id })
                })
                if(!response.ok) throw new Error("Errore nel modificare la recensione");
                recensioniAggiornate = recensioni.map(r =>
                    r.utente_valutante === utente.id ? { ...r, valutazione: stelle } : r);
            }

            setRecensioni(recensioniAggiornate);
            ricalcolaStelle(recensioniAggiornate)
            console.log("Recensioni" + recensioniAggiornate.forEach(r => console.log(r)) + " finite")
            console.log("Appunto" + appunto.id + " " + "Stellle nuove" + + stelle)
            setValutazioneUtente(stelle)

            /*Aggiorna campo Valutazione :serve per filtrare*/
            const somma = recensioniAggiornate.reduce((acc, rec) => acc + rec.valutazione, 0);
            console.log(somma);
            const media = somma / recensioniAggiornate.length;
            const valutazioneMedia = Math.round(media);
            console.log("Quindi valutazione media " + valutazioneMedia)

            response = await fetch(`/api/appunti/${appunto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valutazione: valutazioneMedia })
            })
            if (!response.ok) throw new Error("Errore nell'aggiornare la valutazione");

            /*Ricarica gli appunti nell'homepage */
            onSave();
        } catch (error) {
            alert(error.message)
        }
    }

    const eliminaAppunto = async () => {
        const conferma = window.confirm(
            "Sei sicuro di voler eliminare questo appunto? L'operazione non si può annullare."
        );
        if (!conferma) return;
        try {
            const response = await fetch(`/api/appunti/${appunto.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url_thumbnail: appunto.url_thumbnail,
                    url_file: appunto.url_file,
                }),
            });
            console.log("Errore elimina " + response.error)
            if (!response.ok) throw new Error("Errore nell'eliminazione");
            onSave(); // ricarica lista
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <div className="col-lg-4  col-md-6 col-12">
            <div className="border rounded p-3 h-100 shadow-sm position-relative">
                {loading && (
                    <div style={{
                        position: 'fixed', inset: 0,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999
                    }}>
                        <div className="spinner-border text-light" role="status" style={{ width: '4rem', height: '4rem' }}>
                            <span className="visually-hidden">Caricamento...</span>
                        </div>
                    </div>
                )}

                <img src={bookMark ? BookMarkSelected : BookMark} className="bookmark position-absolute top-0 end-0 m-2"
                    style={{ width: "24px", height: "24px", zIndex: 1 }}
                    onClick={() => {
                        if (!bookMark) { saveCard(); }
                        else { deleteSavedCard(); }
                        setBookMark(!bookMark);
                        if (isLibreria) { onSave(); }
                    }}
                />

                {
                    errore && (
                        <div className="alert alert-danger position-fixed bottom-0 end-0 m-3" role="alert">
                            {errore}
                        </div>
                    )
                }


                <div className="d-flex w-100 position-relative h-100" >
                    <img className="col-4 object-fit-cover rounded " src={appunto.url_thumbnail} alt="Card image cap" />
                    <div className="d-flex flex-column ms-2 h-100 w-100">
                        <h5>{appunto.titolo}</h5>
                        <span>{stelle}</span>
                        <span>( {recensioni.length} recensioni)</span>
                        <button type="button" className="btn btn-primary mt-auto " data-bs-toggle="modal" data-bs-target={`#modal-${appunto.id}`}>
                            Mostra
                        </button>
                    </div>
                </div>

                {/*Modal */}
                <div className="modal fade" id={`modal-${appunto.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className={`modal-dialog ${showPdfViewer ? "modal-xl" : ""}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{appunto.titolo}</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setShowPdfViewer(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {showPdfViewer ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-link ps-0 mb-2"
                                            onClick={() => setShowPdfViewer(false)}
                                        >
                                            ← Torna ai dettagli
                                        </button>
                                        <PdfDocumentViewer fileUrl={appunto.url_file} />
                                    </>
                                ) : (
                                    <div className="d-flex">
                                        <img className="col-4 object-fit-cover rounded border border-info border-3" src={appunto.url_thumbnail} alt="Card image cap" />
                                        <div className="col-8 d-flex flex-column ms-2">
                                            <h5>{appunto.titolo}</h5>
                                            <span>({recensioni.length}) {stelle}</span>
                                            <span>(di {autore.nome} {autore.cognome})</span>
                                            <span><strong>Descrizione:</strong> {appunto.descrizione}</span>
                                            <p>{appunto.anno}</p>
                                            <span>(Recensione personale)<StelleValutazioni stelleAttuali={valutazioneUtente} onChange={changeRecensioni} /></span>
                                            <div className="row justify-content-between">
                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => setShowPdfViewer(true)}
                                                    >
                                                        Visualizza
                                                    </button>
                                                </div>
                                                <div className="col">
                                                    <a className="btn btn-primary" href={`${appunto.url_file}?download=`}>
                                                        Scarica
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showSegnala && (<Segnala appuntoId={appunto.id} onClose={() => setShowSegnala(false)} />)}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-warning me-auto" onClick={() => setShowSegnala(true)}>
                                    Segnala
                                </button>
                                        {
                                            (isLibreria && sectionActivate === 'caricati') && 
                                             
                                                <button className="btn  btn-danger " onClick={() => {eliminaAppunto();}}>
                                                    Elimina
                                                </button>
                                            
                                        }
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setShowPdfViewer(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}