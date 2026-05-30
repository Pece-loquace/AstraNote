import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./PrivacyPolicy.css"
import "../../style/bootstrap.css"

export default function Privacy() {
    return (
        <div>
            <div>
                <a href="/homepage">
                    <img src={logo} alt="Logo di AstraNote" className="image-fix" />
                </a>
                <hr />
            </div>

            <div className="container d-flex align-items-center justify-content-center py-4">
                <div className="card shadow-lg w-100" style={{ maxWidth: "1000px" }}>
                    <div className="card-body p-4 p-md-5 position-relative">
                        <div className="custom-border"></div>

                        <h3 className="text-center custom-title mb-4">Licenza</h3>

                        <p>
                            Il contenuto di questo sito web è distribuito con licenza Creative Commons
                            (CC BY-NC-ND 4.0) Attribution-NonCommercial-NoDerivatives 4.0 International.
                        </p>

                        <p>
                            <strong>PUOI CONDIVIDERE IL CONTENUTO ALLE SEGUENTI CONDIZIONI:</strong><br />
                            (condividere, riprodurre, distribuire, comunicare al pubblico, esporre in
                            pubblico, rappresentare, eseguire e recitare questo materiale con qualsiasi
                            mezzo e formato).
                        </p>

                        <p>
                            <strong>ATTRIBUZIONE:</strong><br />
                            Devi riconoscere una menzione di paternità adeguata, fornire un link alla
                            licenza e indicare se sono state effettuate delle modifiche. Puoi fare ciò in
                            qualsiasi maniera ragionevole possibile, ma non con modalità tali da suggerire
                            che il licenziante avalli te o il tuo utilizzo del materiale.
                        </p>

                        <p>
                            <strong>NON COMMERCIALE:</strong><br />
                            Non puoi utilizzare il materiale per scopi commerciali.
                        </p>

                        <p>
                            <strong>NESSUNA OPERA DERIVATA:</strong><br />
                            Se remixi, trasformi il materiale o ti basi su di esso, non puoi distribuire
                            il materiale così modificato.
                        </p>

                        <p>
                            <strong>DIVIETO DI RESTRIZIONI AGGIUNTIVE:</strong><br />
                            Non puoi applicare termini legali o misure tecnologiche che impongano ad altri
                            soggetti dei vincoli giuridici su quanto la licenza consente loro di fare.
                        </p>

                        <p>Ci riserviamo il diritto di modificare questa licenza in qualsiasi momento.</p>

                        <p>
                            <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.it">
                                Clicca qui per la licenza completa
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
