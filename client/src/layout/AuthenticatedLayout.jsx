import Nav from "../components/Nav"
import SideBar from "../components/SideBar"
import { useSidebar } from "../context/SidebarContext"

const AuthenticatedLayout = ({ children, hideNav = false, hideBar = false }) => {

    const { barStatus, toggleBar } = useSidebar()

    return(
        <div className="h-screen flex flex-col">
            {!hideNav ? <Nav /> : null }
            <div className="flex flex-1 bg-background-primary">
                {!hideBar ? <SideBar/> : null}
                <div className={`${barStatus ? "ml-[272px]" : "ml-12"} content flex-1 overflow-hidden transition-all`}> 
                    <div className="h-full">
                        {children}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default AuthenticatedLayout