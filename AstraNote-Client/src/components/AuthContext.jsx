import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children })
{
    const [utente, setUtente] = useState(null);
    const [caricamentoAuth, setCaricamentoAuth] = useState(true);

    useEffect(() =>
    {
        fetch('/api/me')
            .then(r => r.json())
            .then(d => setUtente(d.utente))
            .catch(err => console.error(err))
            .finally(() => setCaricamentoAuth(false));
    }, []);

    return (
        <AuthContext.Provider value={{ utente, caricamentoAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);