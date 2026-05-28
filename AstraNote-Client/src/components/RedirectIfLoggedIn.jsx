import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function RedirectIfLoggedIn({ children }) { 
    const navigate = useNavigate();                 
    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/me', { credentials: 'include' });
            const data = await response.json();
            if (data.loggato) {
                navigate("/homepage");            
            }else{
                navigate("/")
            }
        } finally {
            setLoading(false);                      
        }
    };

    if (loading) return null;                    
    return children;                                
}
