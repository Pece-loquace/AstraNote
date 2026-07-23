import { useEffect, useState, useSyncExternalStore } from 'react';
import "../style/Menu.css"

const Menu = ({ isOpen, toggleMenu, isMobile, utente, children }) => {

    if (!isOpen) return null;

    const menuCnt_style = {
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        height: '100%',
        width: '300px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        left: isMobile ? 0 : 'auto',
        right: isMobile ? 'auto' : 0,
    };

    const menuClose_style = {
        top: isMobile ? '5px' : '12px',
        right: isMobile ? '4px' : '0px'
    };

    return (
        <div className="menuCnt" style={menuCnt_style}>
            <div className="menuChild_1">
                <div className="menuChild_2">
                    <section className="menuSection">
                        <div className="menuHeaderCnt">
                            <div className="menuClose" style={menuClose_style}>
                                <span className="menuCloseSvg" onClick={toggleMenu}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </span>
                            </div>
                            <div></div>
                        </div>
                        <div className="menuAccount">
                            <div>
                                <div className="menuNameCnt">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menuIcon">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <a className="menuName">
                                        {utente.nome} {utente.cognome}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <hr/>

                        {children}

                    </section>
                </div>
            </div>
        </div>
    );
};

export default Menu;