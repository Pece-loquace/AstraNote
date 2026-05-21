import { useState, useSyncExternalStore } from 'react'
import searchIcon from "../assets/search.svg"
import libraryIcon from "../assets/library-1.svg"
import profileIcon from "../assets/profile.svg"
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../assets/AstraNote_Logo.svg"
import ReturnButton from "../assets/return-button.svg"
import "../style/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

function Navbar({children}) {
    const [query,setQuery] = useState('');
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();

      const handleKeyDown = (e) => {    
         if (e.key === "Enter" && query.trim() !== " ") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    }

    const Logout = async() =>{
        try {
            const response = await fetch('/api/logout',{method:'POST'});
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
   
    return (
        <>
            <nav className="navbarCnt navbar-expand-lg navbar-expand-md navbar-expand-sm">
                <div className="logoCnt">
                    <Link to="/homepage">
                        <img src={AstraLogo} className="logo" alt="React logo" ></img>
                    </Link>
                </div>
            
                <div className="searchCnt flex-grow-1">
                    <img src={searchIcon} className="searchIcon" alt="searchIcon" />
                    <input className="search" placeholder="Cerca degli appunti..." 
                           onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}></input>
                </div>

                <div className="libraryCnt">
                    <img src={libraryIcon} className="libraryIcon" alt="libraryIcon"></img>
                    <Link className="library" to="/libreria">La tua libreria</Link>
                </div>

                <div className="dropdown">
                    <img src={profileIcon} alt="profile" className="profileIcon"></img>
                    <button className="profile dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Profilo
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="/homepage">Home</a>
                        <a className="dropdown-item" href="/profilo">Profilo</a>
                        <a className="dropdown-item" href="#">Caricati</a>
                        <a className="dropdown-item" href="#">Preferiti</a>
                        <a className="dropdown-item" href="/impostazioni">Impostazioni Account</a>
                        <a className="dropdown-item" id="logoutItem" onClick={()=>(Logout())} >Logout</a>
                    </div>
                </div>

                <div className="settingsCnt_mobile">
                    <img src={settingsIcon} alt="settings" className="settingsIcon"
                         onClick={() => setMenu(!menu)}></img>
                </div>
            </nav>

            <div className={`menu ${menu === true ? 'd-flex' : 'd-none d-md-flex'}`}>
                <div className="libraryCnt">
                    <img src={libraryIcon} className="libraryIcon" alt="libraryIcon"></img>
                    <Link className="library" to="/libreria">La tua libreria</Link>
                </div>

                <div className="dropdown_mobile">
                    <img src={profileIcon} alt="profile" className="profileIcon"></img>
                    <button className="profile dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Profilo
                    </button>
                    <div className="dropdown-menu_mobile" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item action" href="/libreria">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item logout" id="logoutItem" onClick={()=>(Logout())} >Logout</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;