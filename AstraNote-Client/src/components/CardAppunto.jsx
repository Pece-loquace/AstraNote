import { Link } from "react-router-dom";


export default function  CardAppunto({appunto}){
    const{appunti,setAppunti} = useState([]);
    const {numeroDownload, setDownloads} = useState(0);
    const {valutazioneMedia, setMedia} = useState(0);
    
    useEffect(()=>{
        impostaNumeroDownloads()
    },[])

    
    const impostaNumeroDownloads = async() =>{
        const appuntoId = appunto.id;
        try{
            const response = await fetch(`api/file-scaricati?appuntoId=${appuntoId}`);

            if(!response.ok) throw new Error("Impossibile ottenere i file scaricati")

            const risultato = await response.json();
            setDownloads(risultato.appunti.length)
        }catch(err){
            alert(err.message);
        }
    }

    useEffect(()=>{
        impostaMedia()
    },[])

    const impostaMedia = async() => {
        const appuntoId = appunto.id;
        try{
            const response = await fetch (`/api/recensioni/${appunto.id}`)
            if (!response.ok) throw new Error("Errore nel recupero recensioni");

            const response = await response.json();

            const somma = response.rencensioni.reduce((acc, curr) => acc + curr.punteggio, 0);
            setMedia(somma/response.recensioni.length)
        }catch(err){
            alert(err.message)
        }
    }

    return (
        <div>
            <Link to = {`/appunto/${appunto.id}`}>
                <div className = "container text-center">
                    <div className="col">
                        <div className="row">
                            <img 
                            src={appunto.copertina_url}
                            className ="card-img-top"
                            />
                        </div>
                        <div className="row">
                            <h3>{appunto.titolo}</h3>
                        </div>
                        <div className="row">
                            <p>{numeroDownload}</p>
                        </div>
                        <div className = "row">
                            <p>{valutazioneMedia}</p>
                        </div>
                    </div>
                </div>
            </Link>
            
        </div>
    )
}