import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../../style/bootstrap.css";
import "../../style/buttons.css";

import {
    Avatar,
    AVATAR_ICONE,
    AVATAR_COLORI,
    COLORI,
} from "./Avatar";
// importare anche la funzione di valutazione con le stelle

// Modifica Profilo
export default function Impostazioni({ utente, salva, annulla }) {
    const [form, setForm] = useState({
        //NB: solo template sostituire con le chiamate a server
        nome: utente.nome || "",
        cognome: utente.cognome || "",
        matricola: utente.matricola || "",
        facolta: utente.facolta || "",
        // sostituire con funzione di valutazione utente 
        // valutazione: utente.valutazione || 0,
        avatar: {
            iconaId: utente.avatar?.iconaId || AVATAR_ICONE[0].id,
            iconaColore: utente.avatar?.iconaColore || "bianco",
            sfondoColore: utente.avatar?.sfondoColore || "rosso",
        },
    });

    const setField = (key, value) => setForm((prevForm) => ({ ...prevForm, [key]: value }));
    const setAvatar = (key, value) =>
        setForm((prevForm) => ({ ...prevForm, avatar: { ...prevForm.avatar, [key]: value } }));

    const handleSubmit = (evento) => {
        evento.preventDefault();
        salva?.(form);;
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="d-flex align-items-center mb-4">
                <h1 className="h3 mb-0 fw-semibold">Modifica profilo</h1>
                <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={annulla}
                >
                    ← Indietro
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-4">

                    {/* Colonna sinistra: personalizza avatar */}

                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3">
                                <h3 className="fw-semibold mb-4">Avatar</h3>

                                {/* Anteprima live */}
                                <div className="text-center mb-4">
                                    <Avatar
                                        iconaId={form.avatar.iconaId}
                                        iconaColore={form.avatar.iconaColore}
                                        sfondoColore={form.avatar.sfondoColore}
                                        size={140}
                                    />
                                </div>

                                {/* Scelta icona */}
                                <label className="form-label small fw-medium text-uppercase text-muted">
                                    Icona
                                </label>
                                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                    {AVATAR_ICONE.map(({ id, descrizione, Component }) => {
                                        const selected = form.avatar.iconaId === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setAvatar("iconaId", id)}
                                                className={`btn p-2 ${selected ? "btn-primary" : "btn-outline-secondary"
                                                    }`}
                                                style={{ width: 48, height: 48, lineHeight: 0 }}
                                                title={descrizione}
                                                aria-label={descrizione}
                                                aria-pressed={selected}
                                            >
                                                <Component
                                                    color={selected ? "#fff" : "#000"}
                                                    size={28}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Colore icona */}
                                <label className="form-label small fw-medium text-uppercase text-muted mt-4 p-1">
                                    Colore icona
                                </label>
                                <ColoreSelezione
                                    selected={form.avatar.iconaColore}
                                    onSelect={(colore) => setAvatar("iconaColore", colore)}
                                />

                                {/* Colore sfondo */}
                                <label className="form-label small fw-medium text-uppercase text-muted mt-4 p-1">
                                    Colore sfondo
                                </label>
                                <ColoreSelezione
                                    selected={form.avatar.sfondoColore}
                                    onSelect={(colore) => setAvatar("sfondoColore", colore)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colonna destra: Dati utente */}
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3">
                                <h3 className="fw-semibold mb-4">Dati Utente</h3>

                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label htmlFor="nome" className="form-label">
                                            Nome
                                        </label>
                                        <input
                                            id="nome"
                                            type="text"
                                            className="form-control"
                                            value={form.nome}
                                            onChange={(evento) => setField("nome", evento.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="cognome" className="form-label">
                                            Cognome
                                        </label>
                                        <input
                                            id="cognome"
                                            type="text"
                                            className="form-control"
                                            value={form.cognome}
                                            onChange={(evento) => setField("cognome", evento.target.value)}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="matricola" className="form-label">
                                            Matricola
                                        </label>
                                        <input
                                            id="matricola"
                                            type="text"
                                            className="form-control"
                                            value={form.matricola}
                                            onChange={(evento) => setField("matricola", evento.target.value)}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="facolta" className="form-label">
                                            Facoltà
                                        </label>
                                        <input
                                            id="facolta"
                                            type="text"
                                            className="form-control"
                                            value={form.facolta}
                                            onChange={(evento) => setField("facolta", evento.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* solo template, sotituire con valori dal server */}

                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="text"
                                            className="form-control"
                                            value={form.password}
                                            onChange={(evento) => setField("password", evento.target.value)}
                                            disabled
                                        />
                                        <div className="form-text">Inserisci la tua password</div>
                                    </div>

                                    {/* solo template, sostituire con invio al server */}
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">
                                            Nuova Password
                                        </label>
                                        <input
                                            id="password"
                                            type="text"
                                            className="form-control"
                                            value={form.password}
                                            onChange={(evento) => setField("password", evento.target.value)}
                                            disabled
                                        />
                                        <div className="form-text">Inserisci una nuova password</div>
                                    </div>

                                    {/* solo template, sotituire con invio al server */}

                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">
                                            Conferma Password
                                        </label>
                                        <input
                                            id="password"
                                            type="text"
                                            className="form-control"
                                            value={form.password}
                                            onChange={(evento) => setField("password", evento.target.value)}
                                        />
                                        <div className="form-text">Inserisci ancora la nuova password</div>
                                    </div>
                                </div>

                                {/* Pulsanti */}
                                <hr className="my-4" />
                                <div className="d-flex gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={annulla}
                                    >
                                        Annulla
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Salva modifiche
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </form >
        </div >
    );
}

//Funzione di selezione colori
function ColoreSelezione({ selected, onSelect }) {
    return (
        <div className="d-flex flex-wrap justify-content-center gap-2">
            {COLORI.map((chiaveColore) => {
                const isSelected = selected === chiaveColore;
                const color = AVATAR_COLORI[chiaveColore];
                return (
                    <button
                        key={chiaveColore}
                        type="button"
                        onClick={() => onSelect(chiaveColore)}
                        title={maiuscolo(chiaveColore)}
                        aria-label={maiuscolo(chiaveColore)}
                        aria-pressed={isSelected}
                        className="btn p-0 rounded-circle"
                        style={{
                            width: 36,
                            height: 36,
                            backgroundColor: color,
                            border: isSelected
                                ? "3px solid rgb(15, 110, 255)"
                                : (!isSelected)
                                    ? "1px solid rgb(195, 195, 195)"
                                    : "1px solid transparent",
                            boxShadow: isSelected ? "0 0 0 2px #fff inset" : "none",
                        }}
                    />
                );
            })}
        </div>
    );
}

function maiuscolo(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
