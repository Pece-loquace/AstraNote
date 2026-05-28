import { useEffect, useState, useSyncExternalStore } from 'react'
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../assets/AstraNote_Logo.svg"
import "../style/Navbar.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from './Menu';

function Navbar({ children }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const[utente,setUtente] = useState({});
    const [menuMobile, setMenuMobile] = useState(false);
    const [menuDesktop, setMenuDesktop] = useState(false);

    const location = useLocation();

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== " ") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    }

    const Logout = async () => {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                navigate('/');
                alert(data.message)
            } else {
                alert("Errore durante il logout");
            }
        } catch (error) {
            console.error("Errore di rete:", error);
        }
    }

    useEffect(() => {
        fetchUtente();
    }, [location.pathname])

    const autoCloseMenu = () => {
        if (menuDesktop === true) {
            setMenuDesktop(false);
        }

        if (menuMobile === true) {
            setMenuMobile(false);
        }
    }

    const fetchUtente = async () => {
        try {
            const res1 = await fetch("/api/me");
            if (!res1.ok) throw new Error("Errore nel reperire l'utente loggato");
            const logged_user = await res1.json();

            const res2 = await fetch(`/api/utenti/${logged_user.utente.id}`)
            if (!res2.ok) throw new Error("Errore nel reperire l'utente loggato");
            const user = await res2.json();
            setUtente(user);
            console.log(user);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        if (!location.pathname.startsWith('/search')) {
            setQuery('');
        }
    }, [location.pathname]);

    return (
        <>
            <nav className="navbarCnt navbar-expand-lg navbar-expand-md navbar-expand-sm">

                <div className="settingsCntMobile" aria-label="menu-action">
                    <img className="settingsIcon" src={settingsIcon} alt="settings" onClick={() => setMenuMobile(!menuMobile)}></img>
                </div>

                <div className="logoCnt">
                    <a className="clickCnt" href="/homepage">
                        <img src={AstraLogo} className="logo" alt="AstraLogo" onClick={autoCloseMenu}></img>
                    </a>
                </div>

                <div className="searchCnt flex-grow-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="searchIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input className="search text-white" value={query} placeholder="Cerca degli appunti..."
                           onChange={(e) => setQuery(e.target.value)}
                           onClick={autoCloseMenu}
                           onKeyDown={handleKeyDown}></input>
                </div>

                <div className="uploadCnt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uploadIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                    <a className="upload text-white" href="/upload" onClick={autoCloseMenu}>
                        Aggiungi una nota
                    </a>
                </div>

                <div className="libraryCnt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="libraryIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                    </svg>
                    <a className="library text-white" href="/libreria" onClick={autoCloseMenu}>
                        La tua libreria
                    </a>
                </div>

                <div className="accountCnt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="accountIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <a className="account text-white" type="button" onClick={() => setMenuDesktop(!menuDesktop)}>
                        {utente.nome}  {utente.cognome}
                    </a>
                </div>
            </nav>

            {menuMobile !== false && 
            <div className="menuMobile">
                <Menu isOpen={menuMobile} isMobile={true} utente={utente} toggleMenu={() => setMenuMobile(!menuMobile)}>
                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/homepage" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Home
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Torna alla homepage
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href={`/utente/${utente.id}`} onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Profilo
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Gestisci la tua area riservata
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr id="libraryPC"/>

                    <div className="menuOptionsCnt" id="libraryPC">
                        <a className="clickCnt" href="/libreria" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    La tua Libreria
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Visualizza le tue note caricate e salvate
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/impostazioni" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Impostazioni
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Imposta le tue preferenze
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/" onClick={() => {Logout(),autoCloseMenu()}}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Logout
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Disconnetti il tuo account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <hr />
                </Menu>
            </div>
            }

            {menuDesktop !== false && 
            <div className="menuDesktop">
                <Menu isOpen={menuDesktop} isMobile={false} utente={utente} toggleMenu={() => setMenuDesktop(!menuDesktop)}>
                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/homepage" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Home
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Torna alla homepage
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href={`/utente/${utente.id}`} onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Profilo
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Gestisci la tua area riservata
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr id="libraryPC"/>

                    <div className="menuOptionsCnt" id="libraryPC">
                        <a className="clickCnt" href="/libreria" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    La tua Libreria
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Visualizza le tue note caricate e salvate
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/impostazioni" onClick={autoCloseMenu}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Impostazioni
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Imposta le tue preferenze
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <hr />

                    <div className="menuOptionsCnt">
                        <a className="clickCnt" href="/" onClick={() => {Logout(),autoCloseMenu()}}>
                            <div className="menuOptions_child">
                                <div className="optionChild">
                                    <div className="optionSvgCnt">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="optionContent">
                                            <span>
                                                <span className="optionTitle">
                                                    Logout
                                                </span>
                                            </span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="optionSubtitle">
                                            Disconnetti il tuo account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <hr />
                </Menu>
            </div>}
        </>
    )
}

export default Navbar;