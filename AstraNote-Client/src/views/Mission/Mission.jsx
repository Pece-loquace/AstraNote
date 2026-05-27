import { useState, useSyncExternalStore } from 'react'
import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./Mission.css"
import { Link, useNavigate } from 'react-router-dom'
import "../../style/bootstrap.css"

function Mission() {
    return (
        <>
            <div className="">
                <div>
                    <div>
                        <section>
                            <div>
                                <div>
                                    <div>
                                        <Link to="/homepage"><img src={logo} alt="" className="missionLogo" /></Link>
                                    </div>
                                    <div>
                                        {/* <span>
                                            <span className="h3">
                                                Se vuoi condividere o cercare appunti di studenti Sapienza, <br />
                                                questo è il posto giusto per te!
                                            </span>
                                        </span> */}
                                    </div>
                                </div>
                                <hr />
                            </div>

                            <div>
                                <div>
                                    <div>
                                        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
                                            <div className="card shadow-lg w-100" style={{ maxWidth: "1000px" }}>
                                                <div className="card-body p-4 p-md-5 position-relative">
                                                    <div className="custom-border"></div>

                                                    <h3 className="text-center custom-title mb-1">Se vuoi condividere o cercare appunti Sapienza,
                                                        questo è il posto giusto per te!</h3>
                                                    <hr />
                                                    <p className="text-black fst-italic mb-4">

                                                        Quante volte ti è capitato
                                                        di cercare degli appunti (senza succeso)<br />
                                                        nella speranza che ti aiutassero per un esame? <br />
                                                        Quante volte hai scaricato degli appunti<br />
                                                        senza sapere di chi fossero?<br />
                                                        Quante volte hai condiviso degli appunti<br />
                                                        che poi non ti sono mai stati attribuiti?<br />
                                                        Quante volte hai perso degli appunti<br />
                                                        (presi da chissà dove)
                                                        e che non hai più ritrovato? <br />
                                                        <br />
                                                        Se non ti è mai capitato, buon per te! <br />
                                                        Ma se esistesse un'area dedicata soltanto <br />
                                                        allo scambio di dispense tra studenti <br />
                                                        de La Sapienza, non la useresti? <br />
                                                        <br />
                                                        Il nostro sito nasce proprio da questa idea: <br />
                                                        avere uno spazio completamente <br />
                                                        dedicato alla condivisione di materiale <br />
                                                        didattico tra gli studenti iscritti a La Sapienza. <br />
                                                        <br />
                                                        L'utilizzo della tua mail istituzionale <br />
                                                        garantisce la tracciabilità, nonché l'autenticità <br />
                                                        di autori e appunti caricati sul sito.<br />
                                                        <br />
                                                        Su AstraNote puoi caricare i tuoi appunti, puoi salvare <br />
                                                        quelli di altri studenti e (votando con delle stelle) <br />
                                                        puoi valutare la qualità di una qualsiasi dispensa. <br />
                                                        <br />
                                                        Per alcuni, i gruppi di chat online<br />
                                                        sono lo strumento di condivisione più comodo.<br />
                                                        Ma, se vuoi tenere in ordine <br />
                                                        il tuo materiale di studio in uno spazio <br />
                                                        virtuale unico, sicuro e certificato Sapienza, <br />
                                                        allora AstraNote è la scelta giusta per te! <br />
                                                        <br />
                                                        Creato da studenti Sapienza<br />
                                                        per gli studenti Sapienza.<br />
                                                        Buono Studio!!! <br />
                                                    </p>
                                                    <hr />
                                                    <div className='h6'>
                                                        <blockquote className="blockquote mb-0 fst-italic">
                                                            <p>
                                                                "Per Aspera Ad Astra"<br />
                                                                "Attraverso le difficoltà, fino alle stelle."<br />
                                                            </p>
                                                            <footer className="blockquote-footer mt-3">
                                                                Seneca<br />
                                                            </footer>
                                                        </blockquote>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Mission;