import { Link } from "react-router-dom";

export default function AppuntoSpecifico({appunto}){
    return (
        
        <div>
            <div class="card">
                <h6>Titolo</h6>
                
            </div>
            {/*
            <div className="d-flex">
                <img src = {appunto.url_thumbnail}
                  alt = "NessunImmagine"/>
                <div >
                    Titolo:
                    {appunto.titolo}
                </div>
                <div>
                    Descrizione:
                    {appunto.descrizione}
                </div>
            </div>
            */
            }
            {/*
            <div class="d-flex align-items-start gap-3">
                <img src={appunto.url_thumbnail} class="img-fluid" width="200" alt="Foto"/>

                <p>Titolo:{appunto.tiotlo}</p>
                <p>Descrizione: {appunto.descrizione}</p>
                <Link to="/utentespecifico"></Link>    
            </div>
            */}
        </div>
    )
}