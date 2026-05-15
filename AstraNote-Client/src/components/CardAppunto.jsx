
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Segnala from "./Segnala";


export default function  CardAppunto({appunto}){
    const[appunti,setAppunti] = useState([]);
    const [numeroDownload, setDownloads] = useState(0);
    const [stelle, setStelle] = useState("");
    const[loading,setLoading] = useState(false);
    const[utente,setUtente] = useState([])
    const [showSegnala, setShowSegnala] = useState(false);

    useEffect(() => { 
            fetchCard()
    },[])
   
    const fetchCard = async() => { 
        const appuntoId = appunto.id;
        console.log("Appunto id" + appuntoId)
        try {
            const[res1, res2, res3] = await Promise.all([
               fetch(`/api/appunti/${appuntoId}/downloads`), 
               fetch(`/api/recensioni/${appuntoId}`),
               fetch(`/api/utenti/${appunto.id_autore}`)   /*Per caricare nome e cognome dell'utente*/
            ])
            
            console.log("Chiamata 1" +res1.ok)
            console.log("Chiamata 2" + res2.ok)
            console.log("Chiamata 3" + res3.ok)

            if(!res1.ok || !res2.ok || !res3.ok){
                throw new Error("Errore nel recupero dati");
            }

            const [file_scaricati,recensioni,utente] = await Promise.all([res1.json(),res2.json(),res3.json()])
            
            /*Setta l'utente */
            setUtente(utente)

            /*Setta i downloads */
            setDownloads(Array.isArray(file_scaricati) ? file_scaricati.length : 0)

            /*Setta le stelle */
            if(recensioni.length == 0){
                setStelle("☆".repeat(5))
            }else{
                const somma = recensioni.reduce((acc, curr) => acc + curr.punteggio, 0);
                const  media  = somma / recensioni.length
                const valutazioneMedia = Math.round(media);
                const stringaStelle = "⭐".repeat(valutazioneMedia) + "☆".repeat(5-valutazioneMedia);
                setStelle (stringaStelle)
            }

        } catch (error) {
            alert(error.message)
        }
    }



    const handleScarica = async() => {
        setLoading(true);
        try{
            const response = await fetch ("/api/downloads",{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({appunto_id: appunto.id})
            })
            if(!response.ok) throw new Error("Errore nel recupero dati");
            setLoading(false);
        }catch(error){
            console.log(error)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className = "col-lg-3  col-md-6 col-12">
            <div className="border rounded p-3 h-100 shadow-sm">
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

            <div className="d-flex w-100" >
                <img className="col-4 object-fit-cover rounded " src={appunto.url_thumbnail} alt="Card image cap" />
                <div className="d-flex flex-column ms-2">
                    <h5>{appunto.titolo}</h5>
                    <p>({numeroDownload}){stelle}</p>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#modal-${appunto.id}`}>
                        Mostra
                    </button>
                </div>
            </div>
            
           {/*Modal */}
            <div className="modal fade" id={`modal-${appunto.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex">
                            <img className="col-4 object-fit-cover rounded border border-info border border-3" src={appunto.url_thumbnail} alt="Card image cap" />
                            <div className="d-flex flex-column ms-2">
                                <h5>{appunto.titolo}</h5>
                                <p>Descrizione: {appunto.descrizione}</p>
                                <p>{utente.nome} {utente.cognome}</p>
                                <p>({numeroDownload}) {stelle}</p>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary"  data-bs-target={`#modal-${appunto.id}`} onClick={handleScarica}>
                                Scarica 
                        </button>
                        <button className="btn  btn-warning"  onClick={()  => { console.log("ID CHE STO MANDANDO:", appunto.id);setShowSegnala(true)}}>
                                Segnala
                        </button>
                         {showSegnala && (<Segnala appuntoId={appunto.id} onClose={() => setShowSegnala(false)}/>)}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}