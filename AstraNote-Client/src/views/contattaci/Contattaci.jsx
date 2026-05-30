import logo from "../../assets/AstraNote_Banner_IT_720.png"
import "./Contattaci.css"
import "../../style/bootstrap.css"
import chat from "../../assets/chat.svg"

function Contattaci() {
    return (
        <div>
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
                            <h3 className="text-center custom-title mb-1">Contattaci</h3>
                            <img src={chat} alt="Vignetta che sorride" className="image-fix" />
                            <ul
                                className="text-black d-inline-block fst-italic mb-4 text-start p-4 text-fix"
                            >
                                <li>Simone Pietro Alteri - alteri.1642077@studenti.uniroma1.it</li>
                                <li>Valerio Grasso - grasso.2108914@studenti.uniroma1.it</li>
                                <li>Alessandro Corvi - corvi.1946241@studenti.uniroma1.it</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Contattaci