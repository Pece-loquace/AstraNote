import { useState } from "react";


export default function Segnala({ appuntoId, onClose }) {
    const[errore,setErrore] = useState(false)
    const[invio,setInvio] = useState(false)
    const[messaggio,setMessaggio] = useState("")
    const MAX_SEGNALAZIONI_GIORNALIERE = 3;

    const handleSubmit = async() => {
            setInvio(false);   
            setErrore(false);
            // qui poi farai la fetch per segnalare
            console.log("APPUNTO ID CHE STO MANDANDO:", appuntoId);
            if(messaggio.length == 0){
                setErrore("Il messaggio è vuoto")
            }else{
                try {
                /*Vedi quante segnalazioni sono state fatte dall'utente con la sessione corrente giornalmente */
                const response = await fetch('/api/segnalazioni_utente')
                if(!response) throw new Error("Errore nell'ottenere le segnalazioni");

                const segnalazioniUtente = await response.json();
                segnalazioniUtente.forEach(s=> console.log(s));
                const currentDate = new Date().toDateString();

                const segnalazioniGiornaliere = segnalazioniUtente.filter(s => new Date(s.created_at).toDateString() === currentDate)
                if(segnalazioniGiornaliere.length >= MAX_SEGNALAZIONI_GIORNALIERE){
                    setErrore("Hai raggiunto il massimo di segnalazioni giornaliere: " + MAX_SEGNALAZIONI_GIORNALIERE)
                }else{
                    const response = await fetch('/api/segnalazioni',{
                        method:'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({messaggio,appuntoId})
                    })  
                    if(!response.ok) throw new Error("Impossibile segnalare l'appunto")
                    setInvio(true);
                }
            } catch (error) {
                console.log(error)
            }
            
        };
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "400px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
            >
                <h5>Segnala Appunto</h5>

                <textarea
                    className="form-control"
                    placeholder="Scrivi il motivo della segnalazione..."
                    onChange = {(e) => setMessaggio(e.target.value)}
                />

                {
                    errore && <div class="alert alert-danger alert-dismissible fade show mt-4" role="alert  ">
                        <strong>Errore!</strong>{errore}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                }
                {
                    (invio)  && 
                    <div class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                        <strong>Inviato!</strong> I tuoi dati sono stati trasmessi con successo.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>


                }

                <div className="d-flex justify-content-end mt-3 gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Annulla
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={handleSubmit}
                    >
                        Invia
                    </button>
                </div>
               
            </div>
        </div>
    );
}