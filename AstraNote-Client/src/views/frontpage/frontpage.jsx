import { useState} from 'react';
import RegistrazioneConFacolta from '../register/Register'
import '../../style/sfondo.css'
import '../../style/buttons.css'
import './frontpage.css'
import logo from "../../../public/AstraNote_Banner_IT.png"


const Frontpage = () =>{
    const [view, setView] = useState('frontpage');
    return (
        <>
        <div className="sfondo"></div>
        <div id="overlay"></div>
        <div className="scurisco"></div>

        <div className={`cnt ${view}`}>
            
            <div className="panel left">
                <div className="form-box" style={{width: '40vw'}}>
                    <h2>Accedi</h2>
                    <input type="text" placeholder="Email" />
                    <button className="btn-custom" onClick={() => setView('frontpage')}>Annulla</button>
                </div>
            </div>

            <div className="frontpage">
                <img src={logo} alt="logo" className="logo"/>
                <div className="buttons">
                    <div className="d-flex gap-5 justifyContent-center">
                        {view !== 'login' && (
                        <>
                        <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                onClick={() => setView('login')}>
                            Accedi
                        </button>
                        {view !== 'frontpage' && (
                            <button className="btn-custom_2" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                    onClick={() => setView('frontpage')}>
                                Indietro
                            </button>
                        )}
                        </>
                        )}                            
                        
                        {view !== 'register' && (
                        <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                onClick={() => setView('register')}>
                            Registrati
                        </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="panel right">
                <RegistrazioneConFacolta className="form-box" style={{width: '40vw'}}/>
            </div>
        </div>
        </>
    );
};

export default Frontpage;