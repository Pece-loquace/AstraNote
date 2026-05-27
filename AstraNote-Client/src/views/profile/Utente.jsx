import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import "./Utente.css";

import profile from "../../assets/profile-circle.svg";
import CardAppunto from "../../components/CardAppunto";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Profilo() {
    const { id: id_utente } = useParams();
    const [isUtenteLoggato, setIsUtenteLoggato] = useState(false);
    const [utente, setUtente] = useState({});
    const [appunti, setAppunti] = useState([]);
    const [mediaUtente, setMediaUtente] = useState(0);
    const [nomeFacolta, setNomeFacolta] = useState(null);
    const [caricamento, setCaricamento] = useState(true);

    useEffect(() => {
        const init = async () => {
            setCaricamento(true);
            await fetchUtente();
            setCaricamento(false);
        };
        init();
    }, []);

    const fetchUtente = async () => {
        console.log("Id utente" + id_utente)
        try {
            const res1 = await fetch('/api/me');
            if (!res1.ok) throw new Error('Errore in /api/me');
            const logged_user = await res1.json();

            if (logged_user.id === id_utente) {
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

            if (!res3.ok || !res4.ok || !res5.ok) {
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

    if (caricamento) {
        return <LoadingSpinner />;
    }

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center py-3">
            <div className="container align-items-center py-2">
                <div className="card shadow-lg mb-4">
                    <div className="card-body p-4 p-md-5 position-relative">
                        <div className="custom-border"></div>

                        <div className="row align-items-center g-4">

                            {/* Foto profilo */}
                            <div className="col-12 col-md-auto text-center">
                                <img
                                    src={profile}
                                    alt="Immagine profilo"
                                    className="immagine-profilo rounded-circle"
                                />
                            </div>

                            {/* Informazioni utente */}
                            <div className="col">
                                <h1 className="custom-title mb-3 py-1">
                                    {utente.nome} {utente.cognome}
                                </h1>

                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <div className="custom-label">Matricola</div>
                                        <div className="fw-medium">{utente.matricola}</div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="custom-label">Facoltà</div>
                                        <div className="fw-medium">{nomeFacolta}</div>
                                    </div>

                                    <div className="col-12">
                                        <div className="custom-label">Valutazione media</div>
                                        <div className="h5 mb-0">{mediaUtente}</div>
                                    </div>
                                </div>

                                {isUtenteLoggato && (
                                    <>
                                        <hr className="my-4" />
                                        <div className="d-flex justify-content-end">
                                            <Link to="/impostazioni" className="btn-custom">
                                                Modifica profilo
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista appunti*/}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-0 fw-semibold">Appunti caricati</h2>

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