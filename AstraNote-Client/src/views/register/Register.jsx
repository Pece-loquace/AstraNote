import { useState } from 'react'
import {Link} from "react-router-dom"
import '../../style/buttons.css'


const Register = () =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async() =>{
        try{
            const response = await fetch(`/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({username,email,password})
            })
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className = 'register'>
            <form className="form">
                <input type = "text" placeholder = 'Username'/>
                <input type = "email" placeholder = 'Email'/>
                <input type ="password" placeholder = 'password'/>
                <Link to ="http://localhost:5173/homepage">
                    <button className="btn-custom">Invia</button>
                </Link>
                <Link to ="http://localhost:5173">
                    <button className="btn-custom">Indietro</button>
                </Link>
            </form>            
        </div>
    )
}

export default Register;