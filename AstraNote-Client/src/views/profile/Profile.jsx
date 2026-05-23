import React from 'react';
import "./Profile.css";
import profile from "../../assets/profile.svg";
import "../../style/bootstrap.css";
import "../../style/buttons.css";
import { useState } from 'react';
import { useEffect } from 'react';
import CardAppunto from "../../components/CardAppunto";
import { Avatar } from './Avatar';

export default function Profilo() {
    const [utente, setUtente] = useState({});
    const [appunti, setAppunti] = useState([]);
    const [nomeFacolta, setNomeFacolta] = useState("");
    const [mediaUtente, setMediaUtente] = useState(0);

    useEffect(() => {
        fetchUtente()
    }, [])

    const fetchUtente = async () => {
        try {
            const res1 = await fetch('/api/utente_loggato');
            if (!res1.ok) throw new Error("Errore nel reperire l'utente loggato");
            const user = await res1.json();
            setUtente(user);

            const [res2, res3, res4] = await Promise.all([
                fetch(`/api/appunti_caricati/${user.id}`),
                fetch(`/api/facolta/${user.facolta}`),
                fetch(`/api/user_ratings/${user.id}`)
            ]);

            if (!res2.ok || !res3.ok || !res4.ok) {
                throw new Error("Errore nelle chiamate parallele");
            }
            const [notes, uni, user_rating] = await Promise.all([res2.json(), res3.json(), res4.json()]);

            setAppunti(notes);
            setNomeFacolta(uni.nome);
            const media = user_rating.media_valutazioni;
            const valutazioneMedia = "⭐".repeat(user_rating.media_valutazioni) + "☆".repeat(5 - (user_rating.media_valutazioni));
            setMediaUtente(valutazioneMedia);

        } catch (error) {
            console.error(error)
        }
    }



    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center py-1">
            <div className="container align-items-center py-2">
                <div className="card border-primary-subtle shadow-sm mb-4">
                    <div className="card-body align-items-center py-4">
                        <div className="row align-items-center g-1">

                            <div className="col-12 col-md-auto text-center">
                                {/* Test Avatar */}
                                <img src={profile} alt="Avatar utente" width={300} height={300} />

                                {/* <div className="col-12 col-md-auto text-center">
                                    <Avatar
                                        iconaId={avatar.iconaId}
                                        iconaColore={avatar.iconaColore}
                                        bgColore={avatar.bgColore}
                                        size={170}
                                    />
                                </div> */}

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

                                {/* modifica={() => setVista('modifica')} */}

                                <hr className="my-4" />
                                <div className="justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                    // onClick={modifica}
                                    >
                                        Modifica profilo
                                    </button>
                                </div>
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
                                <CardAppunto key={appunto.id} appunto={appunto} onSave={fetchUtente}/>

                            ))}
                        </div>
                    )
                }

            </div>
        </main>
    );
}