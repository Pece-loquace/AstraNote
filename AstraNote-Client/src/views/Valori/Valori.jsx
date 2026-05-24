import logo from "../../assets/AstraNote_Banner_IT_720.png"
import centralità from '../../assets/centrality.svg'
import condivisione from '../../assets/share.svg'
import connessione from '../../assets/connections.svg'
import "./Valori.css"
import { Link } from 'react-router-dom'

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
                                    <Link to="/homepage"><img src={logo} alt="" className="valoriLogo"/></Link>
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

                        <div>
                            <div className="content">
                                <div className="valoreCnt">
                                    <div>
                                        <img className="valoreSvg" src={centralità} alt="centralità" />
                                    </div>
                                    <span>
                                        <span className="h3">
                                            Centralità
                                        </span>
                                    <hr />
                                    </span>
                                    nofsdnfownegqefnepfjefdònvdslnfiewofjdpnsdvonapdneopdfodvnpdsnvdso
                                </div>
                                <div className="valoreCnt">
                                    <div>
                                        <img className="valoreSvg" src={condivisione} alt="condivisione" />
                                    </div>
                                    <span>
                                        <span className="h3">
                                            Condivisione
                                        </span>
                                    <hr />
                                    </span>
                                    nofsdnfownegqefnepfjefdònvdslnfiewofjdpnsdvonapdneopdfodvnpdsnvdso
                                </div>
                                <div className="valoreCnt">
                                    <div>
                                        <img className="valoreSvg" src={connessione} alt="connessione" />
                                    </div>
                                    <span>
                                        <span className="h3">
                                            Connessione
                                        </span>
                                    <hr />
                                    </span>
                                    nofsdnfownegqefnepfjefdònvdslnfiewofjdpnsdvonapdneopdfodvnpdsnvdso
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
export default Valori;