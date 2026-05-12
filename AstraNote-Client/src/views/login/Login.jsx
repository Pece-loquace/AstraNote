import React from 'react'
import {Link} from "react-router-dom"
import '../../style/buttons.css'

const Login = () =>{
   

    const handleSubmit = async(e) => {
        e.preventDefault();
        const { ok, errori, campiInErrore: nuoviErrori } = validaRegistrazione({ ...formData, conferma: formData.confermaPassword });

        if (ok) {
            setFeedback({ show: true, type: "ok", errori: [] });
            setTuttiValidi(true);
            setCampiInErrore(new Set());

            const response = await fetch('/api/register',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome:formData.nome,
                    cognome:formData.cognome,
                    matricola: formData.matricola,
                    email: formData.email,
                    facolta: formData.facolta,
                    password: formData.password,
                })
            });

            if(response.ok){
                navigate("/login");
            }else{
                throw new Error("Impossibile completare l'ordine")
            }

        } else {
            setFeedback({ show: true, type: "error", errori });
            setCampiInErrore(nuoviErrori);
            setTuttiValidi(false);
        }
    };
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