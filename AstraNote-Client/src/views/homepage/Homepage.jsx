import { useState ,useEffect } from "react";
import {Link} from "react-router-dom"
//import Filter from "../../components/Filters";
import Gatto from "./origini-del-gatto.jpg";
import CardAppunto from "../../components/CardAppunto";
const Homepage = () =>{
    const [appuntiFacolta,setAppunti] = useState([])
    const [errore,setErrore] = useState(null)

    //Seleziona i corsi dei vari 
    
    const corsi = Array.from(new Set (appuntiFacolta.map(a => a.corsi)))

    //Campi Filters
    const [corso,setCorso] = useState(null)
    const [data,setData] = useState(null)
    const [stelle,setStelle] = useState(0)

    const appuntiFiltrati = appuntiFacolta

    useEffect(()=>{
        caricaAppunti()
    },[])

    const caricaAppunti = async () =>{
        try {
            const response = await fetch('/api/appunti')
            
            if(!response.ok) throw new Error('Errore nel caricamento')

            const appunti = await response.json()
             console.log(appunti[0]) 
            setAppunti (appunti)
        } catch (error) {
            setErrore(error.message)
            console.error(error.message)
        }
    }

    const loadAppunto = async(idAppunto) =>{
        try{
            const response = await fetch(`api/appunti/${idAppunto}`)

            if(!response.ok) throw new Error("Impossibile ottenere l'ordine")

            const risultato = await response.json();
        }catch(err){
            setErrore(err.message)
            console.log(err)
        }
    }
    
    return (
        <div className="container my-5 flex-grow-1">
            { errore && 
                <div className="alert alert-danger">{ errore }</div>
            }
            

            <div className="row g-4">
                {
                    appuntiFacolta.map((a) => (
                <CardAppunto key = {a.id}  appunto={a} />))
                }    
            </div>
            
            { 
            (appuntiFacolta.length === 0 && !errore) &&
                <div className="text-center">
                    Caricamento appunti...
                </div>
            }
            
        </div>
    );
};

export default Homepage;