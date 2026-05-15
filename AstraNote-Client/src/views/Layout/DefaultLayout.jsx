import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout(){
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
           <Navbar/>
            <main style={{ flex: 1, position: 'relative' }}>
                {/*React sostituisce automaticamente con il componente della route figlia attiva*/}
                <Outlet/>
                 <Link to="/upload" className="btn btn-primary rounded-circle shadow-lg" style={{
            position: 'absolute',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    fontSize: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
          }}>+</Link>
            </main>
          
          <Footer/>
        </div>
        </>
    )
}

