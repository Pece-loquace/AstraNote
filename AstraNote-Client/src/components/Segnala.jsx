import { useState } from "react";


export default function Segnala({ appuntoId, onClose }) {
    const [messaggio,setMessaggio] = useState("")


    const handleSubmit = async() => {
        // qui poi farai la fetch per segnalare
        console.log("APPUNTO ID CHE STO MANDANDO:", appuntoId);
        try {
            const response = await fetch("/api/segnalazioni",{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({messaggio,appuntoId})
            })  
            if(!response.ok) throw new Error("Impossibile segnalare l'appunto")
            console.log("Segnalato appunto:", appuntoId);
            onClose();
        } catch (error) {
            console.log(error)
        }
        
    };

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