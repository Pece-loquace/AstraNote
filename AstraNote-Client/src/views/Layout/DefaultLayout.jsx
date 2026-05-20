import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link, Outlet, useLocation } from "react-router-dom";
import AddButton from "../../components/AddButton";

export default function DefaultLayout(){
    const location = useLocation(); 
    const isUpload = location.pathname === "/upload";
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
           <Navbar/>
            <main className="flex-grow-1" style={{ flex: 1, position: 'relative' }}>
                {/*React sostituisce automaticamente con il componente della route figlia attiva*/}
                <Outlet/>
                {!isUpload && <AddButton/>}
            </main>
          <Footer/>
        </div>
        </>
    )
}

