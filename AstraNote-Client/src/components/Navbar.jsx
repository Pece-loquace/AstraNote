import { useState, useSyncExternalStore } from 'react'
import searchIcon from "../assets/search.svg"
//import libraryIcon from "../assets/library-1.svg"
//import profileIcon from "../assets/profile.svg"
import settingsIcon from "../assets/settings.svg"
import AstraLogo from "../assets/AstraNote_Logo.svg"
import logo from "../assets/AstraNote_Banner_IT_720.png"
import "../style/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

function Navbar({children}) {
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);
    const [profilo, setProfilo] = useState(false);

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

    const Menu = ({isOpen, toggleMenu}) =>{

        return (
            <div className={`menuCnt ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="menuCnt_child_1">
                    <div className="menuCnt_child_2">
                        <section className="menuSection">
                            <div className="menuHeaderCnt">
                                <div className="menuH_child_1">
                                    <div className="menuH_child_2">
                                        <img src={logo} alt="" className="menuLogo"/>

                                        <div className="menuClose">
                                            <span className="menuCloseSvg" onClick={() => setMenu(!menu)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/profilo">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/libreria">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/upload">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
                                                    <div className="optionChild">
                                                        <div className="optionSvgCnt">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="optionContent">
                                                                <span>
                                                                    <span className="optionTitle">
                                                                        Aggiungi una nota
                                                                    </span>
                                                                </span>
                                                                <span className="">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <p className="optionSubtitle">
                                                                Compila il form e distribuisci online la tua nota
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" onClick={()=>(Logout())}>
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1" style={{transform:'none'}}>
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>


                        </section>
                    </div>
                </div>
            </div>
        )
    };

    const Profilo = ({isOpen, toggleProfile}) =>{

        return (
            <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleProfile}>
                <div className="">
                    <div className="">
                        <section className="">
                            <div className="">
                                <div className="">
                                    <div className="">
                                        <div className="">
                                            <span className="profiloCloseSvg" onClick={() => setProfilo(!profilo)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        </div>

                                        <img src={logo} alt="profiloLogo" className="profiloLogo"/>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/profilo">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/libreria">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" href="/upload">
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1">
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
                                                    <div className="optionChild">
                                                        <div className="optionSvgCnt">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="optionSvg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="optionContent">
                                                                <span>
                                                                    <span className="optionTitle">
                                                                        Aggiungi una nota
                                                                    </span>
                                                                </span>
                                                                <span className="">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                                                                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <p className="optionSubtitle">
                                                                Compila il form e distribuisci online la tua nota
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <hr/>

                            <div className="menuOptionsCnt">
                                <a className="clickCnt" onClick={()=>(Logout())}>
                                    <div className="menuOptions_1">
                                        <div className="menuOptions_1" style={{transform:'none'}}>
                                            <div className="menuOptions_2">
                                                <div className="optionCnt">
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
                                                                <span className="">
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
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>


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
                    <input className="search text-white" placeholder="Cerca degli appunti..." 
                           onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}></input>
                </div>

                <div className="uploadCnt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uploadIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                    <Link className="upload text-white"  to="/upload">Aggiungi una nota</Link>
                </div>

                <div className="libraryCnt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="libraryIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                    </svg>
                    <Link className="library text-white"  to="/libreria">La tua libreria</Link>
                </div>

                <div className="dropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="profileIcon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <a class="profile dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Profilo
                    </a>
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