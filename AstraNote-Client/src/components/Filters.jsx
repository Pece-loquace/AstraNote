import { useEffect, useState } from "react";

export default function  Filters({filters,setFilters}){
    const [facolta,setFacolta] = useState([])
    const [corsi,setCorsi] = useState([])
    const [anni,setAnni] = useState([])
    const [stelle,setStelle] = useState("---Select option----")
    
    useEffect(() => {
        loadFilters()
    },[])

    const loadFilters = async() =>{
        const anni = [];
        for(let i = 0; i <= 10; i++){
            anni.push((2026)-i);
        }    
        console.log(anni)
        setAnni(anni);
        
        try {
            const response = await fetch('/api/facolta')
            if(!response.ok) throw new Error('Errore nel caricare le facoltà')

            const data = await response.json()
            console.log(data)
            
            setFacolta(data)
        } catch (error) {
            console.error(error)
        }

    }

    const loadCorsi = async(facoltaId) => {
        try {
            const response = await fetch(`/api/corsi?facolta_id=${facoltaId}`)
            if(!response.ok) throw new Error('Errore nel caricare i corsi')

            const data = await response.json();
            setCorsi(data);
        } catch (error) {
            console.error("Errore nel caricamento dei corsi");
        }
    }


    return(
        <div className="container text-center">
            <div className="row d-flex justify-content-between">

                <div className="col-12 col-md-3 d-flex flex-column align-items-start">
                   <label htmlFor ="facolta" className="form-label fw-bold mb-1">Facoltà:</label>
                   <select className="form-select" name = "facolta" id= "facolta" onChange={(e) => {
                        loadCorsi(e.target.value); 
                        setFilters(prev => ({...prev, facolta: e.target.value}));
                    }}>
                    <option value={""}>---Seleziona una facoltà---</option>
                    {
                        facolta.map(f => <option value = {f.id} key={f.id}>{f.nome}</option>)
                    }
                   </select>
                </div>

                <div className="col-12 col-md-3 d-flex flex-column align-items-start">
                    <label htmlFor ="corsi" className="form-label fw-bold mb-1">Corso:</label>
                    <select  className="form-select" name = "corsi" id= "corsi"  onChange={(e)=>{
                        setFilters(prev => ({...prev, corso: e.target.value}
                        ))}}>
                        <option value={""}>---Seleziona un corso----</option>
                        {
                            corsi.map((corso) => (<option value = {corso.nome} key={corso.id} >{corso.nome}</option>))
                        }
                    </select>
                </div>
                
                <div className="col-12 col-md-3 d-flex flex-column align-items-start">
                    <label htmlFor ="anno" className="form-label fw-bold mb-1">Anno:</label>
                    <select  className="form-select" name = "anno" id= "anno" onChange={(e)=>{
                        setFilters(prev => ({...prev, anno: e.target.value}
                        ))}}>
                        <option value={""}>---Seleziona un anno----</option>
                        {
                            anni.map((anno) => (<option value = {anno} key={anno} >{anno}</option>))
                        }
                    </select>
                </div>
                <div className="col-12 col-md-3 d-flex flex-column align-items-start">
                    <label className="form-label fw-bold mb-1" htmlFor = "stelle">Valutazione: </label>
                    <select  className="form-select" name = "stelle" id= "anno" onChange={(e) => setFilters(prev => ({...prev, stelle: e.target.value}))}>
                        <option value = "0">----------</option>
                        <option value="1">⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                    </select>
                </div>
            </div>
        </div>
        );

}