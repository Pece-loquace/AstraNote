import { Link } from 'react-router-dom';
import '../style/AddButton.css'

export default function AddButton(){
    return(
        <Link to="/upload">
            <div className="floating-container">
                <div className = "floating-button">
                    +
                </div>
            </div>
        </Link>
    )  ; 
}