import { useEffect, useState } from "react";
import '../style/filters.css'
import Select from 'react-select';

export default function Filters({ filters, setFilters })
{
    const [facolta, setFacolta] = useState([])
    const [corsi, setCorsi] = useState([])
    const [anni, setAnni] = useState([])
    const [stelle, setStelle] = useState("---Select option----")
    const placeholderValutazione = "Seleziona una valutazione"
    const placeholderAnno = "Seleziona un anno"
    const placeholderCorso = "Seleziona un corso"
    const placeholderFacolta = "Seleziona una facoltà"



    const selectStyles = { menuPortal: (base) => ({ ...base, zIndex: 999999, }), };

    useEffect(() =>
    {
        loadFilters()
    }, [])

    const loadFilters = async () =>
    {
        const anni = [];
        for (let i = 0; i <= 7; i++)
        {
            anni.push((2026) - i);
        }
        setAnni(anni);

        try
        {
            const response = await fetch('/api/facolta')
            if (!response.ok) throw new Error('Errore nel caricare le facoltà')

            const data = await response.json()
            setFacolta(data)
        } catch (error)
        {
            console.error(error)
        }

    }

    const loadCorsi = async (facoltaId) =>
    {
        try
        {
            const response = await fetch(`/api/corsi?facolta_id=${facoltaId}`)
            if (!response.ok) throw new Error('Errore nel caricare i corsi')

            const data = await response.json();
            setCorsi(data);
        } catch (error)
        {
            console.error("Errore nel caricamento dei corsi");
        }
    }


    return (
        <>

            <div className="filterContainer">
                <div className="filters row d-flex justify-content-between">

                    <div className="filter col-12 col-md-3 d-flex flex-column align-items-stretch border-end">
                        <label htmlFor="facolta" className="form-label fw-bold mb-1">Facoltà:</label>
                        <Select
                            className="reactSelect w-100"
                            classNamePrefix="reactSelect"
                            options={[
                                { value: "", label: placeholderFacolta },
                                ...facolta.map(f => ({ value: f.id, label: f.nome }))
                            ]}
                            onChange={(selected) =>
                            {
                                if (selected.value !== "")
                                {
                                    loadCorsi(selected.value);
                                    setFilters(prev => ({ ...prev, facolta: selected.value }));
                                } else
                                {
                                    setCorsi([]);
                                    setFilters(prev => ({ ...prev, facolta: "", corso: "" }));
                                }
                            }}
                            placeholder={placeholderFacolta}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>

                    <div className=" filter col-12 col-md-3 d-flex flex-column align-items-stretch border-end">
                        <label htmlFor="corsi" className="form-label fw-bold mb-1">Corso:</label>
                        <Select
                            className="reactSelect"
                            classNamePrefix="reactSelect"
                            options={[
                                { value: "", label: placeholderCorso },
                                ...corsi.map(corso => ({ value: corso.nome, label: corso.nome }))
                            ]}

                            onChange={(selected) =>
                            {
                                setFilters(prev => ({
                                    ...prev,
                                    corso: selected ? selected.value : ""
                                }));
                            }}

                            placeholder={placeholderCorso}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                        <small className="d-block mb-1" style={{ color: 'grey' }}>
                            (I corsi vengono caricati solo dopo aver selezionato la facoltà)
                        </small>
                    </div>


                    <div className=" filter col-12 col-md-3 d-flex flex-column align-items-stretch border-end">
                        <label htmlFor="anno" className="form-label fw-bold mb-1">Anno:</label>

                        <Select
                            className="reactSelect w-100"
                            classNamePrefix="reactSelect"
                            options={[
                                { value: "", label: placeholderAnno },
                                ...anni.map(anno => ({ value: anno, label: anno }))
                            ]}
                            onChange={(selected) =>
                            {
                                setFilters(prev => ({ ...prev, anno: selected ? selected.value : "" }));
                            }}
                            placeholder={placeholderAnno}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>



                    <div className=" filter col-12 col-md-3 d-flex flex-column align-items-stretch">
                        <label className="form-label fw-bold mb-1" htmlFor="stelle">Valutazione: </label>
                        <Select
                            className="reactSelect"
                            classNamePrefix="reactSelect"
                            options={[
                                { value: "", label: placeholderValutazione },
                                { value: 1, label: "⭐" },
                                { value: 2, label: "⭐⭐" },
                                { value: 3, label: "⭐⭐⭐" },
                                { value: 4, label: "⭐⭐⭐⭐" },
                                { value: 5, label: "⭐⭐⭐⭐⭐" },
                            ]}

                            onChange={(selected) =>
                            {
                                setFilters(prev => ({ ...prev, stelle: selected ? selected.value : "" }));

                            }}
                            placeholder={placeholderValutazione}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>
                    <br></br>
                </div>
            </div>
        </>
    );

}