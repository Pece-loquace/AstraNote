import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import CardAppunto from "../../components/CardAppunto";

export default function Searchpage(){
    const [appunti,setAppunti] = useState([])
    const[error,setError] = useState("")
    const[loading,setLoading] = useState(true)

    /*Recupera il valore di q dall'URL */
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';


    useEffect(() => {
        caricaRisultato()
    },[query])
   
    const caricaRisultato = async() => {

        try {
            const response = await fetch('/api/appunti');
            if(!response.ok) throw new Error("Impossibile caricare il risultato");

            const data = await response.json();
            
            const dataFiltrati =  data.filter((a) => a.titolo.toLowerCase().startsWith(query.toLocaleLowerCase()))
            setAppunti(dataFiltrati)
            setLoading(false)
        } catch (err) {
            setError(err.message)
            console.error(err)
        }finally{
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (

        <div className="container my-5 flex-grow-1">
            <div>
                <h1>Ricerca: {query}</h1>
            </div>

        
            <div className="row g-4">
                    {
                        appunti.map((a) =>(<CardAppunto key={a.id} appunto={a} />))
                    }           
            </div>

        </div>
    );
}