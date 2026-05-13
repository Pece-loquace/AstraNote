import { Outlet } from "react-router-dom";

export default function AuthLayout(){
    return (
        <>
        <main>
            {/*React sostituisce automaticamente con il componente della route figlia attiva*/}
            <Outlet/>
        </main>
        </>
    )
}

