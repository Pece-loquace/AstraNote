import { useEffect } from "react"
import { useState } from "react"
import Filters from "../../components/Filters"
import CardAppunto from "../../components/CardAppunto"


export default function Libreria(){
    /*Devo accedere da localStorage */
    const [appuntiCaricati,setAppuntiCaricati] = useState([])
    const [appuntiPreferiti,setAppuntiPreferiti] = useState([])
    const [filters,setFilters] = useState({facolta:"",corso:"",anno:"",stelle:""})
    const [sezioneAttiva,setSezioneAttiva] = useState("caricati")

    useEffect(()=>{
        caricaLibreria()
    },[])

    const caricaLibreria = async() =>{
        console.log("Aggiorno preferiti")
        try {
            const [res1,res2] = await Promise.all([
                fetch('/api/preferiti'),
                fetch('/api/appunti') 
            ])
            
            if(!res1.ok || !res2.ok ) throw new Error("Impossibile caricare i dati")
            
            const[ris1,ris2] = await Promise.all([res1.json(),res2.json()])

            setAppuntiPreferiti(ris1)
            setAppuntiCaricati(ris2)
            console.log(" preferiti aggiornati")
        }catch (error) {
            console.log("Errore nella chiamata")
            console.error(error)
        }
    }

    const Reload = () => {
        window.location.reload();
    }
    
    return(
       <div className="container my-5 flex-grow-1">
                        <ul className="nav">
                            <li className="nav-item">
                                    <button
                                className={`nav-link ${sezioneAttiva === "caricati" ? "active" : ""}`}
                                onClick={() => setSezioneAttiva("caricati")}  
                            >
                                Appunti Caricati ({appuntiCaricati.length})
                            </button>
                            </li>
                            <li className="nav-item">
                                <button
                                className={`nav-link ${sezioneAttiva === "scaricati" ? "active" : ""}`}
                                onClick={() => setSezioneAttiva("scaricati")}  
                            >
                                Appunti Salvati ({appuntiPreferiti.length})
                            </button>
                            </li>
                        </ul>
            
                   <div className="mb-4">
                       <Filters filters={filters} setFilters={setFilters}/>
                   </div>

                   {
                    (sezioneAttiva === "caricati") && ( 
                        appuntiCaricati.length === 0 ? <p>Nessun appunto caricato</p>: 
                        <div className="row g-4"> 
                        {   
                                appuntiCaricati.map((a) =>(<CardAppunto key={a.id} appunto={a} onSave={Reload}/>))
                        }
                        </div>
                    )
                   }

                   {
                    (sezioneAttiva === "scaricati") &&  
                       (appuntiPreferiti.length === 0 ? <p>Nessun appunto scaricato</p>: 
                        <div className="row g-4"> 
                        {
                            appuntiPreferiti.map((a) =>(<CardAppunto key={a.id} appunto={a} onSave={Reload}/>))
                        }
                        </div>)
                   }
        </div>
    );
}