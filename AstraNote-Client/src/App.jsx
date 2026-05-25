import Frontpage from "./views/frontpage/frontpage"
import Homepage from "./views/homepage/Homepage"
import DefaultLayout from "./views/Layout/DefaultLayout"
import AppuntoSpecifico from './components/AppuntoSpecifico'

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import UploadNota from "./views/uploadnota/UploadNota"
import Searchpage from "./views/searchpage/searchpage"
import Libreria from "./views/libreria/Libreria"
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn"
import Profile from "./views/profile/Profile"
import Impostazioni from "./views/impostazioni/Impostazioni"
import ModificaAppunto from "./components/ModificaAppunto";
import Mission from "./views/Mission/Mission"
import Valori from "./views/Valori/Valori"

import ScrollToTop from "./components/ScrollToTop";


export default function App() {

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<RedirectIfLoggedIn><Frontpage /></RedirectIfLoggedIn>} />

        <Route element={<DefaultLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/appunto_specifico" element={<AppuntoSpecifico />} />
          <Route path="/search" element={<Searchpage />} />
          <Route path="/libreria" element={<Libreria />} />
          <Route path="/upload" element={<UploadNota />} />
          <Route path="/profilo" element ={<Profile/>}/>
          <Route path="/impostazioni" element={<Impostazioni/>}/>
          <Route path="/modifica/:id" element = {<ModificaAppunto/>}/>
          <Route path="/La_nostra_Mission" element = {<Mission/>}/>
          <Route path="/I_nostri_Valori" element = {<Valori/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}