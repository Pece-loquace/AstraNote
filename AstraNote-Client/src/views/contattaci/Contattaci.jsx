import { useState, useSyncExternalStore } from 'react'
import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./Contattaci.css"
import { Link, useNavigate } from 'react-router-dom'
import "../../style/bootstrap.css"

function Contattaci() {
    return (

        <div>
            <div>
                <Link to="/homepage"><img src={logo} alt="" className="contattaciLogo" /></Link>
                <hr />
            </div>
            <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
                <div className="card shadow-lg w-100" style={{ maxWidth: "1000px" }}>
                    <div className="card-body p-4 p-md-5 position-relative">
                        <div className="custom-border"></div>
                        <h3 className="text-center custom-title mb-1">Contatti</h3>
                        <p className="text-black fst-italic mb-4">
                            test
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Contattaci