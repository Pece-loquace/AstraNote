import logo from "../../assets/AstraNote_Banner_IT_720.png"
import centralità from '../../assets/centrality.svg'
import condivisione from '../../assets/connection-relation.svg'
import connessione from '../../assets/connection-relation.svg'
import qualità from '../../assets/star.svg'
import "./Valori.css"
import { Link } from 'react-router-dom'
import "../../style/bootstrap.css"

function Valori() {
    return (
        <>
            <div className="valoriCnt">
                <div>
                    <div>
                        <section>
                            <div>
                                <div>
                                    <div>
                                        <a href="/homepage"><img src={logo} alt="" className="valoriLogo" /></a>
                                    </div>
                                    <div className="title">
                                        <span>
                                            <span className="h2">
                                                I nostri Valori
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <hr />
                            </div>

                            <div className="container my-5 flex-grow-1">
                                <div className="row g-4">
                                    <div className="valoreCnt col-lg-4">
                                        <div>
                                            <img className="valoreSvg" src={centralità} alt="centralità" />
                                        </div>
                                        <span>
                                            <span className="h3">
                                                Centralità
                                            </span>
                                            <hr />
                                        </span>
                                        Un unico sito gratuito e facile da usare su tutti i tuoi dispositivi.
                                    </div>
                                    <div className="valoreCnt col-lg-4">
                                        <div>
                                            <img className="valoreSvg" src={condivisione} alt="condivisione" />
                                        </div>
                                        <span>
                                            <span className="h3">
                                                Condivisione
                                            </span>
                                            <hr />
                                        </span>
                                        Traccia e condividi tutti i tuoi dati e i tuoi appunti in sicurezza.
                                    </div>
                                    <div className="valoreCnt col-lg-4">
                                        <div>
                                            <img className="valoreSvg" src={qualità} alt="Immagine di una stella" />
                                        </div>
                                        <span>
                                            <span className="h3">
                                                Qualità
                                            </span>
                                            <hr />
                                        </span>
                                        La comunità gestisce uno spazio unico e positivo per tutti.
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div >
            </div >
        </>
    )
}
export default Valori;