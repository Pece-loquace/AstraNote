import { useState } from 'react'



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
            <form>
                <input type = "text" placeholder = 'Username'/>
                <input type = "email" placeholder = 'Email'/>
                <input type ="password" placeholder = 'password'/>
            </form>            
        </div>
    )
}

export default Register;