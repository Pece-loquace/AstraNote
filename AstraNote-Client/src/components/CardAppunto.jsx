import { useState } from "react";
import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Segnala from "./Segnala";
import BookMark from "../assets/bookMark.png"
import BookMarkSelected from "../assets/bookmarkSelected.png"
import '../style/CardAppunto.css'
import StelleValutazioni from "./StelleValutazioni";
import ModificaNote from "./ModificaAppunto";
import Matita from "../assets/matita.svg"
import profile from "../assets/profile-circle.svg";


export default function CardAppunto({ appunto, onSave, sectionActivate }) {
    const [stelle, setStelle] = useState("");
    const [utente, setUtente] = useState([])
    const [autore, setAutore] = useState([])
    const [showSegnala, setShowSegnala] = useState(false);
    const [showModifica, setShowModifica] = useState(false);
    const [bookMark, setBookMark] = useState(false)
    const [errore, setErrore] = useState(false)
    const [valutazioneUtente, setValutazioneUtente] = useState(0)
    const [recensioni, setRecensioni] = useState([]);
    const [caricamentoCard, setCaricamentoCard] = useState(true);
    const navigate = useNavigate();

    /*Controlla se l'URL corrente è libreria */
    const location = useLocation();
    const isLibreria = location.pathname === "/libreria";

    useEffect(() => {
        fetchCard()
    }, [])

    const fetchCard = async () => {
        const appuntoId = appunto.id;
        console.log(appunto);
        try {
            setCaricamentoCard(true);
            const [res1, res2, res3, res4] = await Promise.all([
                fetch(`/api/appunti/${appuntoId}/preferiti`),
                fetch(`/api/recensioni/${appuntoId}`),
                fetch(`/api/utenti/${appunto.id_autore}`),   /*Per caricare nome e cognome dell'utente*/
                fetch('/api/me')
            ])

            if (!res1.ok || !res2.ok || !res3.ok || !res4.ok) {
                throw new Error("Errore nel recupero dati");
            }

            const [preferiti, recensioni, autore, ris4] = await Promise.all([res1.json(), res2.json(), res3.json(), res4.json()])
            setAutore(autore);
            /*Setta l'utente */
            setUtente(ris4.utente);
            /* Controllo se l'utente corrente ha salvato l'appunto*/
            const isPresente = preferiti.some(p => String(p.user_id) === String(ris4.utente.id));
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

            const recensioneUtente =  recensioni.find(r => String(r.utente_valutante) === String(ris4.utente.id));
            setValutazioneUtente(recensioneUtente ? recensioneUtente.valutazione : 0);

        } catch (error) {
            alert(error.message)
        } finally {
            setCaricamentoCard(false);
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
                if (!response.ok) throw new Error("Errore nel modificare la recensione");
                recensioniAggiornate = recensioni.map(r =>
                    r.utente_valutante === utente.id ? { ...r, valutazione: stelle } : r);
            }

            setRecensioni(recensioniAggiornate);
            ricalcolaStelle(recensioniAggiornate)
            console.log("Recensioni" + recensioniAggiornate.forEach(r => console.log(r)) + " finite")
            console.log("Appunto" + appunto.id + " " + "Stelle nuove" + + stelle)
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

    const modificaAppunto = () => {
        // Rimuove il backdrop del modal manualmente
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();

        setTimeout(() => {
            navigate(`/modifica/${appunto.id}`);
        }, 300);
    };

    const autoreAppunto = () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();

        setTimeout(() => {
            navigate(`/utente/${autore.id}`);
        }, 300);
    }


    if (caricamentoCard) {
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
        <div className=" col-lg-4  col-md-6 col-12 h-100">
            <div className="cardCnt ">
                <div className="position-absolute top-0 end-0 m-2 d-flex flex-column align-items-center" style={{ zIndex: 1 }}>
                    {/* Bookmark */}
                    <div className="bookmarkCnt">
                        <svg className="bookmarkImg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill={bookMark ? "currentColor" : "none"}
                            onClick={() => { if (!bookMark) { saveCard(); } else { deleteSavedCard(); } setBookMark(!bookMark); if(isLibreria){onSave();} }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>

                    {/* Matita */}
                    {(isLibreria && sectionActivate === 'caricati') && (
                        <img className="pencilImg"
                            src={Matita}
                            alt="Modifica"
                            onClick={modificaAppunto}
                        />
                    )}
                </div>

                {
                    errore && (
                        <div className="alert alert-danger position-fixed bottom-0 end-0 m-3" role="alert">
                            {errore}
                        </div>
                    )
                }

                <div className=" d-flex 6 w-100 position-relative h-100" data-bs-toggle="modal" data-bs-target={`#modal-${appunto.id}`}>
                    <div className="col-4">
                        <img className=" anteprima object-fit-cover rounded " src={appunto.url_thumbnail} alt="Card image cap" />
                        <span className="anno">{appunto.anno_riferimento}</span>
                        <div className="recensioneCnt">
                            <span>{stelle}</span>
                            <span>( {recensioni.length} recensioni)</span>
                        </div>
                    </div>

                    <div className="sezioneDestra d-flex flex-column  position-relative  ms-2 h-100 w-100 pe-3 overflow-hidden">
                        {/*Text- break forza il ritorno a capo anche per parole lunghe */}
                        <div className="titoloAppunto" >
                            <h5 className="text-break">{appunto.titolo}</h5>
                        </div>
                        <span >{appunto.corso.facolta.nome}</span>
                        <hr className="linea" />
                        <div className="dopoLinea">      
                            <span >{appunto.corso.nome}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*Modal */}
            <div className="modal fade" id={`modal-${appunto.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex">


                                <div className="col-4 d-flex flex-column align-items-center">
                                    <img
                                        className="anteprima object-fit-cover rounded border border-info border-3 w-100"
                                        src={appunto.url_thumbnail}
                                        alt="Card image cap"
                                    />
                                    <span >Caricato il: {new Date(appunto.data_creazione).toLocaleDateString("it-IT")}</span>
                                    <a
                                        className="clickCnt mt-2"
                                        href={`/utente/${autore.id}`}
                                        onClick={autoreAppunto}
                                    >
                                        <div className="autore-container">
                                            <img
                                                src={profile}
                                                alt="Immagine profilo"
                                                className="logo-profilo rounded-circle"
                                            />

                                            <span className="fw-bold"> {autore.nome} {autore.cognome}</span>
                                        </div>
                                    </a>
                                </div>

                                <div className="col-8 d-flex flex-column ms-2  position-relative">
                                    <div className="text-start d-flex flex-column align-items-start">
                                        <h5>{appunto.titolo}</h5>
                                        <span>
                                            {stelle} ({recensioni.length === 1 ? '1 recensione' : `${recensioni.length} recensioni`})
                                        </span>
                                        <span className="text-break"><strong>Descrizione:</strong> {appunto.descrizione}</span>
                                        <p>{appunto.anno}</p>
                                    </div>

                                    <div className="position-absolute  bottom-0 start-0 w-100">
                                        <span><StelleValutazioni stelleAttuali={valutazioneUtente} onChange={changeRecensioni} />(Recensione personale)</span>
                                        <div className="row justify-content-between">
                                            <div className="col">
                                                <button type="button" className="btn btn-primary" data-bs-target={`#modal-${appunto.id}`} onClick={() => window.open(appunto.url_file, '_blank')}>
                                                    Visualizza
                                                </button>
                                            </div>
                                            <div className="col">
                                                <a type="button" className="btn btn-primary" href={`${appunto.url_file}?download=`}>
                                                    Scarica
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {showSegnala && (<Segnala appuntoId={appunto.id} onClose={() => setShowSegnala(false)} />)}
                        </div>
                        <div className="modal-footer">

                            {     
                                (!isLibreria || (isLibreria && sectionActivate === 'salvati')) &&
                                <button className="btn btn-warning me-auto" onClick={() => setShowSegnala(true)}>
                                    Segnala
                                </button>
                            }

                            {
                                (isLibreria && sectionActivate === 'caricati') &&
                                <button className="btn  btn-danger " onClick={() => {eliminaAppunto();}}>
                                    Elimina
                                </button>
                            }
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}