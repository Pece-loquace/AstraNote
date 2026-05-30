import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./Mission.css"
import "../../style/bootstrap.css"

function Mission() {
    return (
        <div>
            <div>
                <a href="/homepage">
                    <img src={logo} alt="Logo di AstraNote" className="image-fix" />
                </a>
            </div>

            <hr />

            <div>
                <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
                    <div className="card shadow-lg w-100" style={{ maxWidth: "1000px" }}>
                        <div className="card-body p-4 p-md-5 position-relative">
                            <div className="custom-border"></div>

                            <h3 className="text-center custom-title mb-1">
                                Se vuoi condividere o cercare appunti Sapienza, questo è il posto giusto per te!
                            </h3>
                            <hr />

                            <div className="text-black fst-italic mb-4">
                                <p>
                                    Quante volte ti è capitato di cercare degli appunti (senza successo)
                                    nella speranza che ti aiutassero per un esame? Quante volte hai
                                    scaricato degli appunti senza sapere di chi fossero? Quante volte hai
                                    condiviso degli appunti che poi non ti sono mai stati attribuiti?
                                    Quante volte hai perso degli appunti (presi da chissà dove) e che non
                                    hai più ritrovato?
                                </p>

                                <p>
                                    Se non ti è mai capitato, buon per te! Ma se esistesse un'area dedicata
                                    soltanto allo scambio di dispense tra studenti de La Sapienza, non la
                                    useresti?
                                </p>

                                <p>
                                    Il nostro sito nasce proprio da questa idea: avere uno spazio
                                    completamente dedicato alla condivisione di materiale didattico tra gli
                                    studenti iscritti a La Sapienza.
                                </p>

                                <p>
                                    L'utilizzo della tua mail istituzionale garantisce la tracciabilità,
                                    nonché l'autenticità di autori e appunti caricati sul sito.
                                </p>

                                <p>
                                    Su AstraNote puoi caricare i tuoi appunti, puoi salvare quelli di altri
                                    studenti e (votando con delle stelle) puoi valutare la qualità di una
                                    qualsiasi dispensa.
                                </p>

                                <p>
                                    Per alcuni, i gruppi di chat online sono lo strumento di condivisione
                                    più comodo. Ma, se vuoi tenere in ordine il tuo materiale di studio in
                                    uno spazio virtuale unico, sicuro e certificato Sapienza, allora
                                    AstraNote è la scelta giusta per te!
                                </p>

                                <p className="mb-0">
                                    Creato da studenti Sapienza per gli studenti Sapienza.<br />
                                    Buono Studio!!!
                                </p>
                            </div>

                            <hr />
                            <div className='h6'>
                                <blockquote className="blockquote mb-0 fst-italic">
                                    <p>
                                        "Per Aspera Ad Astra"<br />
                                        "Attraverso le difficoltà, fino alle stelle."
                                    </p>
                                    <footer className="blockquote-footer mt-3">
                                        Seneca
                                    </footer>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mission