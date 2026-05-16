import { useState ,useEffect } from "react";
import {Link} from "react-router-dom"
//import Filter from "../../components/Filters";
import Gatto from "./origini-del-gatto.jpg";
import CardAppunto from "../../components/CardAppunto";
import Filters from "../../components/Filters";
const Homepage = () =>{
    const [appuntiFacolta,setAppunti] = useState([])
    const [errore,setErrore] = useState(null)
    const [filters,setFilters] = useState({facolta:"",corso:"",anno:"",stelle:""})

   
    //Campi Filters
    const [corso,setCorso] = useState(null)
    const [data,setData] = useState(null)
    const [stelle,setStelle] = useState(0)

    useEffect(()=>{
        caricaAppunti()
    },[])
    

    const caricaAppunti = async () =>{
        try {
            const response = await fetch('/api/appunti')
            
            if(!response.ok) throw new Error('Errore nel caricamento')

            const appunti = await response.json()
            console.log("Appunti " + appunti) 
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
    const appuntiFiltrati = appuntiFacolta.filter(a => {
        if(filters.facolta !== "" && String(a.corso.facolta.id) !== String(filters.facolta)) return false;
        if(filters.corso !== "" && (a.corso.nome) !== filters.corso) return false;
        if(filters.anno !== "" && String(a.anno_riferimento) !== String(filters.anno)) return false;
        if(filters.stelle !== "" && String(a.valutazione) !== String(filters.stelle)) return false;
        return true;
    });
    


    return (
        <div className="container my-5 flex-grow-1">
            { errore && 
                <div className="alert alert-danger">{ errore }</div>
            }
        
            <div className="mb-4">   
                <Filters filters={filters} setFilters={setFilters} />
            </div>

            {
                
            }


            <div className="row g-4 m-3">
                {
                    appuntiFiltrati.map((a) => (
                <CardAppunto key = {a.id}  appunto={a} />))
                }    
            </div>
            
            {
                appuntiFiltrati.length === 0 && 
                <div className="text-center">
                    Nessun appunto trovato
                </div>
            }

           
            
        </div>
    );
};

export default Homepage;