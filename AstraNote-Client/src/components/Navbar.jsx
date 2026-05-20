import { useState } from 'react'
import searchIcon from "../assets/search.svg"
import libraryIcon from "../assets/library-1.svg"
import profileIcon from "../assets/profile.svg"
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../assets/AstraNote_Logo.svg"
import "../style/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

function Navbar({children}) {
    const [lang, setLang] = useState('it');
    const [query,setQuery] = useState('');
    const navigate = useNavigate();

    const cambiaLingua = () => {setLang(lang === 'it' ? 'en' : 'it')};

    /*<div className="temaCnt">
                <img src={themeIcon} alt="tema" className="tema"></img>
            </div>*/
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

            <div class="dropdown">
                <button class=" profileCnt dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {/*<img src={profileIcon} alt="profile" className="profileIcon"></img>*/}
                    Profilo
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <button className="btn btn-danger" onClick={()=>(Logout())}>Logout</button>
                </div>
            </div>

    

            <div className="settingsCnt">
                <img src={settingsIcon} alt="settings" className="settingsIcon"></img>
            </div>
          </nav>
        </>
    )
}

export default Navbar;