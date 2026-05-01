import {Link} from "react-router-dom"
const Frontpage = () =>{
    return (
        <div>
            <div className = "login">
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
            <div className="register">
                <Link to ="/register">
                    <button>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Frontpage;