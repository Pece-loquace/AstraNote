import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Outlet } from "react-router-dom";

export default function DefaultLayout(){
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
           <Navbar/>
            <main className="flex-grow-1">
                {/*React sostituisce automaticamente con il componente della route figlia attiva*/}
                <Outlet/>
            </main>
          <Footer/>
        </div>
        </>
    )
}

