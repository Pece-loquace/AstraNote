import React from 'react'

const Login = () =>{
    function handleOnSubmit(){
        alert("Loggato");
    }

    return (
        <div className = 'auth'>
            <h1>Login</h1>
            <form onSubmit = {handleOnSubmit}>
                <input type="email" placeholder = 'email'/>
                <input type="password" placeholder = 'password'/>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;