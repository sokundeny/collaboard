import { useLocation, useNavigate } from "react-router-dom"
import { useSidebar } from "../context/SidebarContext"
import CreateBoardModal from "./CreateBoardModal"
import FolderIcon from "./icons/FolderIcon"
import HomeIcon from "./icons/HomeIcon"
import PersonIcon from "./icons/PersonIcon"
import SignoutIcon from "./icons/SignoutIcon"
import { useState } from "react"
import { createBoards } from "../services/api"
import useAuth from "../hooks/useAuth"

const SideBar = () => {
    const { barStatus, toggleBar } = useSidebar(); 
    const [ modalActive, setModalActive ] = useState(false) 
    const location = useLocation()
    const navigate = useNavigate()
    const {logoutUser}=useAuth()

    const barItems = [
        { id: "Home", path: "/", icon: HomeIcon },
        { id: "Boards", path: "/boards", icon: FolderIcon },
        { id: "Personal", path: "/personal", icon: PersonIcon }
    ]

    const handleCreateBoard = async (title, description, visibility) => {
        try {
            const response = await createBoards(title, description, visibility)
            console.log(response)
            // setReload(prev =>!prev);
            setModalActive(false)
        } catch(err) {
            console.error(err);
        }
    }
      
    return(
        <aside className={`${barStatus ? 'w-[240px] p-4' : 'w-[48px]'} h-[calc(100vh-80px)] mt-20 bg-background-primary 
                        border-r-2 box-content border-border transition-all duration-75 
                        py-2.5 ease-in-out flex flex-col justify-between items-center fixed`}
        >
            <div className="w-full flex flex-col items-center gap-3 ">
                <div className={`${barStatus ? 'flex justify-between w-full items-center' : ''} h-[30px]`}>
                    <h1 className={`${barStatus ? '' : 'hidden'} text-2xl font-medium text-white`}>Menu</h1>
                    <button className="w-6 h-[30px] text-white text-opacity-75"
                        onClick={toggleBar}
                    >   
                    
                        <svg className={`${barStatus ? '' : 'transform rotate-180'}`}
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" 
                            viewBox="0 0 16 16"
                        >
                            <path fill="currentColor" 
                                d="m9.707 8.5l.647.647a.5.5 0 0 1-.708.707l-1.5-1.5a.5.5 0 0 1 0-.707l1.5-1.5a.5.5 0 0 1 .708.707l-.647.646h1.791a.5.5 0 0 1 0 1zM4 3a2 2 0 0 0-2 2v6.002a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM3 5a1 1 0 0 1 1-1h2.002v8.002H4a1 1 0 0 1-1-1zm4.002 7.002V4H12a1 1 0 0 1 1 1v6.002a1 1 0 0 1-1 1z"
                            />
                        </svg>
                    </button>
                </div>
                <button 
                    className={`h-8 bg-brand-yellow hover:bg-brand-yellow-hover flex justify-center items-center rounded-lg
                            text-background-primary ${barStatus ? 'w-full' : 'w-8'} `}
                    onClick={() =>setModalActive(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24"
                    >
                        <path fill="none" 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="1.5" 
                            d="M18 12h-6m0 0H6m6 0V6m0 6v6"
                        />
                    </svg>
                    <h1 className={`font-medium transition-opacity ease-linear duration-100 
                                ${barStatus ? 'opacity-100' : 'opacity-0 hidden'}`}
                    >
                        Create New
                    </h1>
                </button>
                <div className={`font-normal flex flex-col gap-1.5 ${barStatus ? "w-full " : "w-9"} items-center`}>
                    {barItems.map((item, idx) => (
                        <button 
                            key={idx}
                            className ={
                                `h-7 w-full flex gap-2 items-center rounded-lg
                                ${barStatus ? "justify-start py-1 px-2" : "justify-center"}
                                ${location.pathname === item.path ? "font-medium text-background-primary bg-white bg-opacity-75" : "text-white opacity-75"}`
                            }
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon/> 
                            <h1 className={`text-base ${barStatus ? "" : "hidden"}`}>
                                {item.id}
                            </h1>
                        </button>
                    ))}
                </div>
            </div>

            <div className="py-2.5 text-white opacity-75">
                <button title="Sign Out" onClick={()=>{logoutUser()}}>
                    <SignoutIcon /> 
                </button>
            </div>

            <CreateBoardModal 
				active={modalActive}
				onClose={() => setModalActive(false)}
				onCreate={(title, description, visibility) => handleCreateBoard(title, description, visibility)}
			/>
        </aside>
    )
}

export default SideBar