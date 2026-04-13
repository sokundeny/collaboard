import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/Logo.png";

const Logo = ({ size = 64 }) => {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate('/')}>
            <img src={LogoImage} alt="Logo" style={{ width: size, height: size }}/> 
        </button>
    );
};

export default Logo;