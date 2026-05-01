import './App.css'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Register from "./views/register/Register"
import Frontpage from "./views/frontpage/frontpage"
import Homepage from "./views/homepage/Homepage"
import Login from "./views/login/Login"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

/*
const Layout = ()=> {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  );
};

*/
const router = createBrowserRouter([
  {
    path:"/",
    element:<Frontpage/>,
  },
  {
    path:"/register",
    element: <Register/>,
  },
  {
    path:"/login",
    element: <Login/>,
  },
  {
    path:"/homepage",
    element:<Homepage/>,
  }
]);


function App() {
  return (
    <div>
      <RouterProvider router = {router}/>
    </div>
  )
}

export default App
