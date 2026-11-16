import { useEffect } from "react"
import { useState } from "react"
import Filters from "../../components/Filters"
import CardAppunto from "../../components/CardAppunto"
import './Libreria.css'


export default function Libreria() {
    /*Devo accedere da localStorage */
    const [appuntiCaricati, setAppuntiCaricati] = useState([])
    const [appuntiSalvati, setAppuntiSalvati] = useState([])
    const [filters, setFilters] = useState({ facolta: "", corso: "", anno: "", stelle: "" })
    const [sezioneAttiva, setSezioneAttiva] = useState("caricati")
    const [erroreLibreria, setErroreLibreria] = useState("")

    useEffect(() => {
        caricaLibreria()
    }, [])

    const caricaLibreria = async () => {
        try {
            const [res1, res2] = await Promise.all([
                fetch('/api/preferiti_utente'),
                fetch('/api/appunti_caricati')
            ])
            if (!res1.ok || !res2.ok) throw new Error("Impossibile caricare i dati")

            const [ris1, ris2] = await Promise.all([res1.json(), res2.json()])
            setAppuntiSalvati(ris1)
            setAppuntiCaricati(ris2)
        } catch (error) {
            console.error(error)
        }
    }

    const onCardChange = (evento) => {
        if (!evento) return
        if (evento.tipo === "unsave") {
            setAppuntiSalvati(prev => prev.filter(a => a.id !== evento.id))
        }
        if (evento.tipo === "save" && evento.appunto) {
            setAppuntiSalvati(prev => prev.some(a => a.id === evento.appunto.id) ? prev : [evento.appunto, ...prev])
        }
        if (evento.tipo === "delete") {
            setErroreLibreria("")
            setAppuntiCaricati(prev => prev.filter(a => a.id !== evento.id))
            setAppuntiSalvati(prev => prev.filter(a => a.id !== evento.id))
        }
        if (evento.tipo === "restore" && evento.appunto) {
            setAppuntiCaricati(prev => prev.some(a => a.id === evento.appunto.id) ? prev : [evento.appunto, ...prev])
            setErroreLibreria(evento.errore || "Impossibile completare l'operazione.")
        }
    }

    const appuntiCaricatiFiltrati = appuntiCaricati.filter(a => {
        if (filters.facolta !== "" && String(a.corso.facolta.id) !== String(filters.facolta)) return false
        if (filters.corso !== "" && (a.corso.nome) !== filters.corso) return false
        if (filters.anno !== "" && String(a.anno_riferimento) !== String(filters.anno)) return false
        if (filters.stelle !== "" && String(a.valutazione) !== String(filters.stelle)) return false
        return true
    })

    const appuntiSalvatiFiltrati = appuntiSalvati.filter(a => {
        if (filters.facolta !== "" && String(a.corso.facolta.id) !== String(filters.facolta)) return false
        if (filters.corso !== "" && (a.corso.nome) !== filters.corso) return false
        if (filters.anno !== "" && String(a.anno_riferimento) !== String(filters.anno)) return false
        if (filters.stelle !== "" && String(a.valutazione) !== String(filters.stelle)) return false
        return true
    })

    return (
        <div className="libCnt container my-5 flex-grow-1">
            <ul className="nav gap-3">
                <li className="appunti nav-item">
                    <button
                        className={`nav-link ${sezioneAttiva === "caricati" ? "active" : ""}`}
                        onClick={() => setSezioneAttiva("caricati")}
                    >
                        Appunti Caricati ({appuntiCaricatiFiltrati.length})
                    </button>
                </li>
                <li className="appunti nav-item">
                    <button
                        className={`nav-link ${sezioneAttiva === "salvati" ? "active" : ""}`}
                        onClick={() => setSezioneAttiva("salvati")}
                    >
                        Appunti Salvati ({appuntiSalvatiFiltrati.length})
                    </button>
                </li>
            </ul>

            <div className="mt-4 mb-4">
                <Filters filters={filters} setFilters={setFilters} />
            </div>

            {erroreLibreria && (
                <div className="alert alert-danger" role="alert">{erroreLibreria}</div>
            )}

            {
                (sezioneAttiva === "caricati") && (
                    appuntiCaricatiFiltrati.length === 0 ? <p>Nessun appunto caricato</p> :
                        <div className="row g-4">
                            {
                                appuntiCaricatiFiltrati.map((a) => (<CardAppunto key={a.id} appunto={a} onSave={onCardChange} sectionActivate={sezioneAttiva} />))
                            }
                        </div>
                )
            }

            {
                (sezioneAttiva === "salvati") &&
                (appuntiSalvatiFiltrati.length === 0 ? <p>Nessun appunto scaricato</p> :
                    <div className="row g-4">
                        {
                            appuntiSalvatiFiltrati.map((a) => (<CardAppunto key={a.id} appunto={a} onSave={onCardChange} sectionActivate={sezioneAttiva} />))
                        }
                    </div>)
            }
        </div>
    )
}