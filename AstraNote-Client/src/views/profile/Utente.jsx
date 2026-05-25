import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import "./Utente.css";

import profile from "../../assets/profile-circle.svg";
import CardAppunto from "../../components/CardAppunto";

export default function Profilo() {
    const { id: id_utente } = useParams();
    const [isUtenteLoggato, setIsUtenteLoggato] = useState(false);
    const [utente, setUtente] = useState({});
    const [appunti, setAppunti] = useState([]);
    const [mediaUtente, setMediaUtente] = useState(0);
    const[nomeFacolta,setNomeFacolta] = useState(null);

    useEffect(() => {
        fetchUtente()
    }, [])

    const fetchUtente = async () => {
        console.log("Id utente" + id_utente)
        try {
            const res1 = await fetch('/api/me');
            if(!res1.ok) throw new Error('Errore in /api/me');
            const logged_user = await res1.json();

            if(logged_user.id === id_utente){
                setIsUtenteLoggato(true);
            }

            const res2 = await fetch(`/api/utenti/${id_utente}`);
            if (!res2.ok) throw new Error("Errore nel reperire l'utente ");
            const user = await res2.json();
            setUtente(user);
            

            const [res3, res4, res5] = await Promise.all([
                fetch(`/api/appunti_caricati/${user.id}`),
                fetch(`/api/facolta/${user.facolta}`),
                fetch(`/api/user_ratings/${user.id}`)
            ]);

            if (!res3.ok || !res4.ok || !res5.ok ) {
                throw new Error("Errore nelle chiamate parallele");
            }
            const [notes, facolta, user_rating] = await Promise.all([res3.json(), res4.json(), res5.json()]);

            setAppunti(notes);
            setNomeFacolta(facolta.nome);
            const media = user_rating.media_valutazioni;
            const valutazioneMedia = "⭐".repeat(user_rating.media_valutazioni) + "☆".repeat(5 - (user_rating.media_valutazioni));
            setMediaUtente(valutazioneMedia);

        } catch (error) {
            console.error(error)
        }
    }

    // Se l'utente ha caricato una foto, il backend dovrebbe restituirne il
    // percorso/URL in "utente.foto_profilo". In caso contrario, viene mostrata
    // l'immagine di default "profile.svg".
    const fotoSrc = utente.foto_profilo ? utente.foto_profilo : profile;

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center py-3">
            <div className="container align-items-center py-2">
                <div className="card shadow-sm mb-4">
                    <div className="card-body align-items-center py-5">
                        <div className="row align-items-center g-1">

                            <div className="col-12 col-md-auto text-center">
                                <img
                                    src={fotoSrc}
                                    alt="Foto profilo"
                                    className="foto-profilo rounded-circle"
                                />
                            </div>

                            {/* Informazioni utente */}
                            <div className="col">
                                <h2 className="h mb-1 fw-semibold">
                                    {utente.nome} {utente.cognome}
                                </h2>

                                <div className="h5 text-muted mb-1">
                                    Matricola <span className="fw-medium text-body">{utente.matricola}</span>
                                </div>

                                <div className="text-muted mb-2">
                                    Facoltà: <span className="fw-medium text-body">{nomeFacolta}</span>
                                </div>

                                {/* posizione stelle*/}
                                <div className="h5 mb-3">{mediaUtente}</div>

                                {/* Modifica */}
                                { isUtenteLoggato && 
                                    (
                                        <div>
                                            <hr className="my-4" />
                                            <div className="justify-content-end">
                                                <Link to="/impostazioni" className="btn btn-primary">Modifica profilo</Link>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista appunti*/}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-0 fw-semibold">I tuoi appunti</h2>

                        <span className="badge text-bg-light">
                            {appunti.length} {appunti.length === 1 ? 'appunto' : 'appunti'}
                        </span>
                    </div>
                </div>


                {
                    appunti.length === 0 ? (
                        <div className="card border-0 bg-light">
                            <div className="card-body text-center py-5 text-muted">
                                <p className="mb-2">Non hai ancora caricato appunti.</p>
                                <p className="mb-0 small">Inizia a condividere le tue note!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {appunti.map((appunto) => (
                                <CardAppunto key={appunto.id} appunto={appunto} onSave={fetchUtente} />

                            ))}
                        </div>
                    )
                }

            </div>
        </main >
    );
}