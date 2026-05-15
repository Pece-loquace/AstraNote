import { useEffect } from "react"
import { useState } from "react"
import Filters from "../../components/Filters"
import CardAppunto from "../../components/CardAppunto"


export default function Libreria(){
    const [appuntiScaricati,setAppuntiScaricati] = useState([])
    const [appuntiCaricati,setAppuntiCaricati] = useState([])
    const [filters,setFilters] = useState({facolta:"",anno:"",stelle:""})
    const [sezioneAttiva,setSezioneAttiva] = useState("caricati")

    useEffect(()=>{
        caricaLibreria()
    },[])

    const caricaLibreria = async() =>{
        try {
            const [res1,res2] = await Promise.all([
                fetch('/api/file_scaricati'),
                /*fetch('/api/file_caricati'),*/
                fetch('/api/appunti')
            ])
            console.error("Chiamata 1 " + res1.ok)
            console.error("Chaiamta 2 " +res2.ok)
            if(!res1.ok || !res2.ok ) throw new Error("Impossibile caricare i dati")
            
            const[ris1,ris2] = await Promise.all([res1.json(),res2.json()])

            setAppuntiScaricati( ris1)
            setAppuntiCaricati(ris2)
        } catch (error) {
            console.log("Errore nella chiamata")
            console.error(error)
        }
    }
    
    /*Per eliminare i download duplicati altrimenti dava errore nella map quando si metteva key={id} */
    const appuntiScaricatiUnici = [...new Map(appuntiScaricati.map(a => [a.id, a])).values()]

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
                                Appunti Scaricati ({appuntiScaricati.length})
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
                                appuntiCaricati.map((a) =>(<CardAppunto key={a.id} appunto={a} appunto_mode = {"caricati"}/>))
                        }
                        </div>
                    )
                   }

                   {
                    (sezioneAttiva === "scaricati") &&  
                       (appuntiScaricati.length === 0 ? <p>Nessun appunto scaricato</p>: 
                        <div className="row g-4"> 
                        {
                            appuntiScaricatiUnici.map((a) =>(<CardAppunto key={a.id} appunto={a} />))
                        }
                        </div>)
                   }
        </div>
    );
}