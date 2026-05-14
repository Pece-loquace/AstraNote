import { useState} from 'react';
import RegistrazioneConFacolta from '../register/Register'
import Login from '../login/Login'
import '../../style/sfondo.css'
import '../../style/buttons.css'
import './frontpage.css'
import logo from "../../assets/AstraNote_Banner_IT_720.png"


const Frontpage = () =>{
    const [view, setView] = useState('frontpage');
    
    return (
        <>
        <div className="sfondo"></div>
        <div id="overlay"></div>

        <div className={`cnt ${view}`}>
            
            <div className="panel left">
                <Login className="form-box" style={{width: '40vw'}}/>
            </div>

            <div className="frontpage">
                <img src={logo} fixed alt="logo" className="astranote"/>
                <div className="buttons">
                    <div className="d-flex gap-5 justifyContent-center">
                        {view !== 'login' && (
                            <>
                            <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                    onClick={() => setView('login')}>
                                Accedi
                            </button>
                            {view !== 'frontpage' && (
                                <button className="btn-back" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                        onClick={() => setView('frontpage')}>
                                    Indietro
                                </button>
                            )}
                            </>
                        )}                            
                        
                        {view !== 'register' && (
                            <>
                            <button className="btn-custom" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                    onClick={() => setView('register')}>
                                Registrati
                            </button>
                            {view !== 'frontpage' && (
                                <button className="btn-back" style={{width: '260px', height: '70px', fontSize: '32px'}}
                                onClick={() => setView('frontpage')}>
                                    Indietro
                                </button>
                            )}
                            </>
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