import React from 'react';
import './bootstrap.css';
import "./Profile.css";
import profile from "./profile.svg";
import "../../style/bootstrap.css";
import "../../style/buttons.css";

export default function Profilo({ utente, appunti = [], modifica }) {
    const {
        nome,
        cognome,
        matricola,
        facolta,
        valutazione,
        // avatar,
    } = utente;

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="custom-card-profilo w-100">
                <div className="container py-4 py-md-5">
                    <div className="card shadow-sm custom-border mb-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center g-4">

                                <div className="col-12 col-md-auto text-center">
                                    {/* Test Avatar */}
                                    <img src={avatar} alt="Avatar utente" width={300} height={300} />



                                </div>

                                {/* Informazioni utente */}
                                <div className="col">
                                    <h1 className="h2 mb-1 fw-semibold">
                                        {nome} {cognome}
                                    </h1>

                                    <div className="text-muted mb-1">
                                        Matricola <span className="fw-medium text-body">{matricola}</span>
                                    </div>

                                    <div className="text-muted mb-1">
                                        Facoltà: <span className="fw-medium text-body">{facolta}</span>
                                    </div>

                                    {/* posizione stelle provvisorie*/}
                                    <div className="mb-3">⭐️⭐️⭐️⭐️⭐️</div>

                                    {/* Modifica */}
                                    {/* modifica={() => setVista('modifica')} */}
                                    <hr className="my-4" />
                                    <div className="justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={modifica}
                                        >
                                            Modifica profilo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista appunti*/}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="h4 mb-0 fw-semibold">I tuoi appunti</h2>
                        <span className="custom-border badge text-bg-light fs-6 fw-normal">
                            {appunti.length} {appunti.length === 1 ? 'appunto' : 'appunti'}
                        </span>
                    </div>

                    {
                        appunti.length === 0 ? (
                            <div className="card border-0 bg-light">
                                <div className="custom-border card-body text-center py-5 text-muted">
                                    <p className="mb-2">Non hai ancora caricato appunti.</p>
                                    <p className="mb-0 small">Inizia a condividere le tue note!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {appunti.map((a) => (
                                    <div key={a.id} className="col-12 col-sm-6 col-lg-4">
                                        <NotaCard nota={a} />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div >
            </div>
        </main>
    );
}

//Note appunti caricati
function NotaCard({ nota }) {
    {/*mettere funzione card appunti caricati*/ }
}