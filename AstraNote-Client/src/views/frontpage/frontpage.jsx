import { useState, useEffect, useRef } from 'react';
import RegistrazioneConFacolta from '../register/Register';
import Login from '../login/Login';
import '../../style/sfondo.css';
import '../../style/buttons.css';
import './frontpage.css';
import logo from "../../assets/AstraNote_Banner_IT_720.png";

const Frontpage = () => {
    const [view, setView] = useState('frontpage');

    const rightPanelRef = useRef(null);

    useEffect(() => {
        if (rightPanelRef.current) {
            rightPanelRef.current.scrollTop = 0;
        }
    }, [view]);

    return (
        <>
            <div className="sfondo"></div>
            <div id="overlay"></div>

            <div className={`cnt ${view} container-fluid px-0`}>

                {/* Pannello sinistro — Login */}
                <div className={`panel left col-12 col-md-5 col-lg-4 ${view === 'login' ? 'd-flex' : 'd-none d-md-flex'} align-items-center justify-content-center`}>
                    <Login className="form-box w-100 px-3 px-md-4" setSection={setView}/>
                </div>

                {/* Centro — Frontpage */}
                <div className={`frontpage d-flex flex-column align-items-center justify-content-center
                                 col-12 col-md-2 col-lg-4
                                 ${view !== 'frontpage' ? 'd-none d-md-flex' : ''}`}>
                    <img
                        src={logo}
                        alt="logo"
                        className="astranote img-fluid mb-4 mb-md-5 px-3 px-md-0"
                    />

                    <div className="buttons w-100 px-3 px-md-0">
                        <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 justify-content-center align-items-center">

                            {view !== 'login' && (
                                <>
                                    <button
                                        className="btn-custom w-100 w-sm-auto"
                                        style={{ maxWidth: '260px', height: '70px', fontSize: 'clamp(20px, 2.5vw, 32px)' }}
                                        onClick={() => setView('login')}
                                    >
                                        Accedi
                                    </button>
                                </>
                            )}

                            {view !== 'register' && (
                                <>
                                    <button
                                        className="btn-custom w-100 w-sm-auto"
                                        style={{ maxWidth: '260px', height: '70px', fontSize: 'clamp(20px, 2.5vw, 32px)' }}
                                        onClick={() => setView('register')}
                                    >
                                        Registrati
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pannello destro — Registrazione */}
                <div className={`panel right col-12 col-md-5 col-lg-4 ${view === 'register' ? '' : 'd-none d-md-flex'} align-items-center justify-content-center`}
                     ref={rightPanelRef}>
                    <RegistrazioneConFacolta className="form-box w-100 px-3 px-md-4" setSection={setView}/>
                </div>

            </div>
        </>
    );
};

export default Frontpage;