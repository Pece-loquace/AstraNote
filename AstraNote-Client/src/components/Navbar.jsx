import { useState } from 'react'
import flagIT from "../assets/flag-italy.svg"
import flagUK from "../assets/flag-uk.svg"
//import themeIcon from "../assets/dark-theme.svg"
import searchIcon from "../assets/search.svg"
import libraryIcon from "../assets/library-1.svg"
import profileIcon from "../assets/profile.svg"
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../../public/AstraNote_Logo.svg"
import "./Navbar.css"

const translations = {
            it: {
                login: "Accedi",
                register: "Registrati",
                settings: "Impostazioni",
                profile: "Profilo",
                library: "La tua Libreria",
                search: "Cerca degli appunti...",
                terms: "Termini e Condizioni",
                footer: "AstraNote 2026 - Tutti i diritti riservati"
            },
            en: {
                login: "Login",
                register: "Create Account",
                settings: "Settings",
                profile: "Profile",
                library: "Your Library",
                search: "Look for some notes...",
                terms: "Terms and Conditions",
                footer: "AstraNote 2026 - All rights reserved"
              }
        };

function Navbar({children}) {
    const [lang, setLang] = useState('it');

    const cambiaLingua = () => {setLang(lang === 'it' ? 'en' : 'it')};

    /*<div className="temaCnt">
                <img src={themeIcon} alt="tema" className="tema"></img>
            </div>*/

    return (
        <>
          <nav className="navbarCnt">
            <div className="logoCnt">
                <img src={AstraLogo} className="logo" alt="React logo"></img>
            </div>
            <div className="flagCnt">
                <img src={lang == 'it' ? flagIT : flagUK} alt="change lang" className="flag" onClick={cambiaLingua}></img>
            </div>
            
            <div className="searchCnt flex-grow-1">
                <img src={searchIcon} className="searchIcon" alt="searchIcon" />
                <input className="search" placeholder={translations[lang].search}></input>
            </div>
            <div className="libraryCnt">
                <img src={libraryIcon} className="libraryIcon" alt="libraryIcon"></img>
                <a href="#" className="library">{translations[lang].library}</a>
            </div>
            <div className="profileCnt">
                <img src={profileIcon} alt="profile" className="profileIcon"></img>
                <a href="#" className="profile">{translations[lang].profile}</a>
            </div>
            <div className="settingsCnt">
                <img src={settingsIcon} alt="settings" className="settingsIcon"></img>
                <a href="#" className="settings">{translations[lang].settings}</a>
            </div>
          </nav>
        </>
    )
}

export default Navbar;