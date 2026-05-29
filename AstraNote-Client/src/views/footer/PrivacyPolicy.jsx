

import { useState, useSyncExternalStore } from 'react'
import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./PrivacyPolicy.css"
import { Link, useNavigate } from 'react-router-dom'
import "../../style/bootstrap.css"
// import chat from "../../assets/chat.svg"
export default function Privacy() {


    return (
        <div>
            <div>
                <div>
                    <Link to="/homepage"><img src={logo} alt="" className="contattaciLogo" /></Link>
                    <hr />
                </div>
                <div className="container d-flex align-items-center justify-content-center py-4">
                    <div className="card shadow-lg w-100" style={{ maxWidth: "1000px" }}>
                        <div className="card-body p-4 p-md-5 position-relative">
                            <div className="custom-border"></div>
                            <h3 className="text-center custom-title mb-1">Licenza</h3>
                            <h5 className="py-4">
                                Il contenuto di questo sito web è distribuito con licenza Creative Commons (CC BY-NC-ND 4.0) Attribution-NonCommercial-NoDerivatives 4.0 International.<br />
                                <br />
                                PUOI CONDIVIDERE IL CONTENUTO ALLE SEGUENTI CONDIZIONI:<br />
                                (condividere,riprodurre, distribuire, comunicare al pubblico, esporre in pubblico, rappresentare, eseguire e recitare questo materiale con qualsiasi mezzo e formato).<br />
                                <br />
                                ATTRIBUZIONE:<br />
                                Devi riconoscere una menzione di paternità adeguata, fornire un link alla licenza e indicare se sono state effettuate delle modifiche.
                                Puoi fare ciò in qualsiasi maniera ragionevole possibile, ma non con modalità tali da suggerire che il licenziante avalli te o il tuo utilizzo del materiale.<br />
                                <br />
                                NON COMMERCIALE:<br />
                                Non puoi utilizzare il materiale per scopi commerciali.<br />
                                <br />
                                Nessuna opera derivata:<br />
                                Se remixi, trasformi il materiale o ti basi su di esso, non puoi distribuire il materiale così modificato.<br />
                                <br />
                                DIVIETO DI RESTRIZIONI AGGIUNTIVE:<br />
                                Non puoi applicare termini legali o misure tecnologiche che impongano ad altri soggetti dei vincoli giuridici su quanto la licenza consente loro di fare.<br />
                                <br />
                                Ci riserviamo il diritto di modificare questa licenza in qualsiasi momento.<br />
                                <br />
                                Nessuna restrizione aggiuntiva.<br />
                                <br />
                                <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.it">Clicca qui per la licenza completa</a>
                            </h5>
                            <div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </div >



    );
}