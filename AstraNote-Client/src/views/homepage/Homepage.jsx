import { useState } from "react";
import {Link} from "react-router-dom"
//import Filter from "../../components/Filters";
import Gatto from "./origini-del-gatto.jpg";
const Homepage = () =>{
    /*
    const {appuntiFacolta,setAppunti} = useState([])
    const [errore,setErrore] = useState(null)

    //Seleziona i corsi dei vari 
    
    const corsi = Array.from(new Set (appuntiFacolta.map(a => a.corsi)))

    //Campi Filters
    const [corso,setCorso] = useState(null)
    const [data,setData] = useState(null)
    const [stelle,setStelle] = useState(0)

    const appuntiFiltrati = appuntiFacolta

    const filterMateria  = (array) => {
        
    }
    const filterStelle = (array) =>{
        
    }

    const filterData = (array) =>{

    }

    useEffect(()=>{
        caricaAppunti()
    },[])

    const caricaAppunti = async () =>{
        try {
            const response = await fetch('/api/appunti')
            if(!response.ok) throw new Error('Errore nel caricamento')

            const appunti = await response.json()
            console.log(appunti)

            setAppunti (appunti)
        } catch (error) {
            setErrore(error.message)
            console.error(err)
        }
    }

    const loadAppunto = async(idAppunto) =>{
        try{
            const response = await fetch(`api/appunti/${idAppunto}`)

            if(!response.ok) throw new Error("Impossibile ottenere l'ordine")

            const risultato = await response.json();
        }catch(err){
            console.log(err)
        }
    }
    */
    return (
        <>
        {/*
            <Filters/>
        <div className="row g-4">
            {
                appuntiFacolta.map((a) => (
                <CardAppunto key = {AppuntoSpecifico.id} appunto={appunto.id} appunto={appunto} />))
            }
        </div>
        */}
        <img src={Gatto}></img><br/>
        <img src={Gatto}></img><br/>
        
        </>
       //Mi servono le cardAppunto
    );
};

export default Homepage;