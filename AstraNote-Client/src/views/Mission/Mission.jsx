import { useState, useSyncExternalStore } from 'react'
import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./Mission.css"
import { Link, useNavigate } from 'react-router-dom'

function Mission() {
    return (
        <>
        <div className="missionCnt">
            <div>
                <div>
                    <section>
                        <div>
                            <div>
                                <div>
                                    <Link to="/homepage"><img src={logo} alt="" className="missionLogo"/></Link>
                                </div>
                                <div>
                                    <span>
                                        <span className="h3">
                                            Se vuoi condividere o ricercare appunti di studenti Sapienza, <br />
                                            questo è il posto giusto per te!
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                        </div>

                        <div>
                            <div>
                                <div>
                                    <span>
                                        <span className="h6">
                                            Quante volte è capitato ad ognuno di noi <br />
                                            di ricevere o inviare delle dispense <br />
                                            sulle chat di Whatsapp, per poi non riuscire <br />
                                            a ritrovarle? A noi tante... <br />
                                            <br />
                                            Se non vi è mai capitato, buon per voi, <br />
                                            ma se esistesse un'area dedicata solamente <br />
                                            allo scambio di dispense tra studenti <br />
                                            iscritti alla Sapienza, non la usereste? <br />
                                            <br />
                                            Questo sito nasce da questa idea, ovvero <br />
                                            dalla volontà di avere uno spazio totalmente <br />
                                            riservato alla condivisione di materiale <br />
                                            didattico tra studenti iscritti alla Sapienza. <br />
                                            <br />
                                            L'utilizzo della mail certificata Sapienza <br />
                                            garantisce l'autenticità dei profili e <br />
                                            inoltre non è necessario il download <br />
                                            delle dispense grazie alla visualizzazione <br />
                                            all'interno del browser. <br />
                                            <br />
                                            Puoi caricare i tuoi appunti, puoi salvare <br />
                                            appunti di altri studenti e tramite le recensioni <br />
                                            puoi giudicare la qualità di una qualsiasi dispensa. <br />
                                            <br />
                                            Whatsapp rimane per alcuni lo strumento più <br />
                                            comodo, ma se non vuoi condividere il tuo <br />
                                            numero di telefono o semplicemente vuoi tenere <br />
                                            il tuo materiale di studio in uno spazio <br />
                                            virtuale unico e sicuro, allora <br />
                                            AstraNote è la scelta giusta per te! <br />
                                            <br />
                                            Buono Studio!!!
                                        </span>
                                    </span>
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