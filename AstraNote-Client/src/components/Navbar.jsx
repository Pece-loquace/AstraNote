import { useState, useSyncExternalStore } from 'react'
import searchIcon from "../assets/search.svg"
import libraryIcon from "../assets/library-1.svg"
import profileIcon from "../assets/profile.svg"
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../assets/AstraNote_Logo.svg"
import logo from "../assets/AstraNote_Banner_IT_720.png"
import "../style/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

function Navbar({children}) {
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

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

    const Menu = ({isOpen, onClick}) =>{

        return (
            <div className={`menuCnt ${isOpen ? "open" : ""}`} onClick={onClick}>
                <div className="menuCnt_child_1">
                    <div className="menuCnt_child_2">
                        <section className="menuSection">
                            <div className="menuHeaderCnt">
                                <div className="menuH_child_1">
                                    <div className="menuH_child_2">
                                        <img src={logo} alt="" className="menuLogo"/>

                                        <div className="menuClose">
                                            <button aria-label="close action" className="menuCloseBtn" onClick={() => setMenu(!menu)}>
                                                <span className="menuCloseSvg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                        <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </section>
                    </div>
                </div>
            </div>
        )
    };
   
    return (
        <>
            <nav className="navbarCnt navbar-expand-lg navbar-expand-md navbar-expand-sm">

                <div aria-label="menu action" className="settingsCntMobile">
                    <img src={settingsIcon} alt="settings" className="settingsIcon" onClick={() => setMenu(!menu)}></img>   
                </div>

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
            </nav>

            {menu !== false && <Menu isOpen={menu} toggleMenu={() => setMenu(!menu)}></Menu>}
        </>
    )
}

export default Navbar;