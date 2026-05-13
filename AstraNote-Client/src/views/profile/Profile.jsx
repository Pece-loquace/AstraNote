import { useState } from "react"


export default function Profile(){

    const [imgUrl,setImgUrl] = useState("")
    const [valutazione,setValutazione] = useState("☆☆☆☆☆")
    const [facolta,setFacolta] = useState("")
    const [user, setUser] = useState("")


    useEffect(()=>{
        fetchProfile()
    },[])


    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/carica_utente')
            if(!response.ok){
                throw new Error("Impossibile accedere alla pagina utente")
            }

            const data = await response.json()
            setImgUrl(data.img_url)
            setFacolta(data.facoltà)
            setUser(data.user)
            setValutazione()

        } catch (error) {
            console.log(error)
        }
    }

    return(
       <>
        <div>
            <h1>{user.username}</h1>
            <p>Nome: {user.nome}</p>
            <p>Cognome: {user.cognome}</p>
            <p>Matricola: {user.matricola}</p>
            <p>Email: {user.email}</p>
            <p>Facoltà: {facoltà}</p>

        </div>
       </> 
    )

}