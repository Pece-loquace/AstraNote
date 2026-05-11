import React from 'react'
import {Link} from "react-router-dom"
import '../../style/buttons.css'

const Login = () =>{
    function handleOnSubmit(){
        alert("Loggato");
    }

    return (
        <>
        <div className = 'auth'>
            <h1>Login</h1>
            <div>
                <form onSubmit = {handleOnSubmit}>
                    <input type="email" placeholder = 'email'/>
                    <input type="password" placeholder = 'password'/>
                    <button className="btn-custom">Login</button>
                    <Link to ="/">
                        <button className="btn-custom">Indietro</button>
                    </Link>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login;