
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Register from "./views/register/Register"
import Frontpage from "./views/frontpage/frontpage"
import Homepage from "./views/homepage/Homepage"
import Login from "./views/login/Login"
import DefaultLayout from "./views/Layout/DefaultLayout"
import AuthLayout  from './views/layout/AuthLayout'

import AppuntoSpecifico from './components/AppuntoSpecifico'

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import UploadNota from "./views/uploadnota/UploadNota"
import Searchpage from "./views/searchpage/searchpage"
import Libreria from "./views/libreria/Libreria"
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn"


export default function App() {
    

  return (  
    <BrowserRouter>
      <Routes>
       <Route path = "/" element = {<RedirectIfLoggedIn><Frontpage/></RedirectIfLoggedIn>}/>
        <Route element={<AuthLayout/>}>
          <Route path = "/upload" element = {<UploadNota/>}/>
        </Route>

        <Route element={<DefaultLayout/>}>
          <Route path = "/homepage" element = {<Homepage/>}/>
          <Route path = "/appunto_specifico" element = {<AppuntoSpecifico/>}/>
          <Route path = "/search" element = {<Searchpage/>}/>
          <Route path = "/libreria" element = {<Libreria/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}