import {Link} from "react-router-dom"
import '../../style/sfondo.css'
import '../../style/buttons.css'
import logo from "../../../public/AstraNote_Banner_IT.png"

const Frontpage = () =>{
    return (
        <>
        <div className="sfondo"></div>
        <div id="overlay"></div>
        <div>
            <img src={logo} alt="logo" className="w-1"
                    style={{ 
                        backgroundSize: '60%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '70%',
                        height: '70%'
                        }}/>
        </div>
        <div className="container mt-5">
            <div className="d-flex gap-5 justify-content-center">
                <Link to="/login">
                    <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}>
                        Accedi
                    </button>
                </Link>

                <Link to="/register">
                    <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}>
                        Registrati
                    </button>
                </Link>
            </div>
        </div>
        </>
    );
};

export default Frontpage;