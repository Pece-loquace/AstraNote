import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import CardAppunto from "../../components/CardAppunto"
import Filters from "../../components/Filters"

const Homepage = () =>
{
    const [appuntiFacolta, setAppunti] = useState([])
    const [errore, setErrore] = useState(null)
    const [caricamento, setCaricamento] = useState(true)
    const [filters, setFilters] = useState({ facolta: "", corso: "", anno: "", stelle: "" })

    useEffect(() =>
    {
        caricaAppunti()
    }, [])

    const caricaAppunti = async () =>
    {
        try
        {
            setCaricamento(true)
            const response = await fetch('/api/appunti')
            if (!response.ok) throw new Error('Errore nel caricamento')

            const appunti = await response.json()
            setAppunti(appunti)
        } catch (error)
        {
            setErrore(error.message)
            console.error(error.message)
        } finally
        {
            setCaricamento(false)
        }
    }

    const appuntiFiltrati = appuntiFacolta.filter(a =>
    {
        if (filters.facolta !== "" && String(a.corso.facolta.id) !== String(filters.facolta)) return false
        if (filters.corso !== "" && (a.corso.nome) !== filters.corso) return false
        if (filters.anno !== "" && String(a.anno_riferimento) !== String(filters.anno)) return false
        if (filters.stelle !== "" && String(a.valutazione) !== String(filters.stelle)) return false
        return true
    })

    return (
        <div className="container my-5 flex-grow-1">
            {errore &&
                <div className="alert alert-danger">{errore}</div>
            }
            <div className="mb-4">
                <Filters filters={filters} setFilters={setFilters} />
            </div>

            {caricamento ? (
                <div className="row g-4 m-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="col-lg-4 col-md-6 col-12">
                            <div className="border rounded p-3 h-100 shadow-sm placeholder-glow">
                                <div className="d-flex gap-2">
                                    <div className="placeholder col-4 rounded" style={{ height: "120px" }}></div>
                                    <div className="col-8">
                                        <div className="placeholder col-8 mb-2"></div>
                                        <div className="placeholder col-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="row g-4 m-3">
                        {
                            appuntiFiltrati.map((a) => (
                                <CardAppunto key={a.id} appunto={a} onSave={caricaAppunti} />))
                        }
                    </div>

                    {
                        appuntiFiltrati.length === 0 &&
                        <div className="text-center">
                            Nessun appunto trovato
                        </div>
                    }
                </>
            )}
        </div>
    )
}

export default Homepage