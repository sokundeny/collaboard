import SearchBar from "./SearchBar"
import Avatar from "./Avatar"
import Avatar3 from "../assets/avatars/avatar.jpg"
import { useNavigate } from "react-router-dom"
import Logo from "./Logo"
import { useEffect, useState } from "react"
import { getUserProfile } from "../services/api"

const Nav = () => {

    const [ user, setUser ] = useState()
    const navigate = useNavigate()

    const fetchUser = async () => {
        try {
            const data = await getUserProfile()
            setUser(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])
    
    const handleProfileClick = () => {
		navigate(`/user/profile`)
	}
    
    return(
        <div className="bg-background-primary h-20 w-full border-b-2 border-border py-4 pl-2 pr-6
                        flex justify-between items-center flex-shrink-0 fixed"
        >
            {/* <h1 className="font-extrabold text-brand-yellow text-2xl">LOGO</h1> */}
            <button 
                className="flex items-center"
                onClick={() => navigate('/')}
            >
                <Logo />
                <h1 className="font-bold text-gray-300 text-2xl hover:bg-gray-700 rounded-lg 
                            transition-colors duration-100 p-2"
                >
                    Collaboard
                </h1>
            </button>

            <SearchBar />

            <button onClick={handleProfileClick}>
                <Avatar src={user?.secure_url || Avatar3}/>
            </button>
        </div>
    )
}

export default Nav