import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Outlet } from "react-router-dom";

export default function AuthLayout(){
    return (
        <>
        <div className="container-fluid px-0">
            <Navbar/>
            <main>
                {/*React sostituisce automaticamente con il componente della route figlia attiva*/}
                <Outlet/>
            </main>
            <Footer/>
        </div>
        </>
    )
}

