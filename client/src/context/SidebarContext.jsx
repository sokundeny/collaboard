import { createContext, useContext, useState } from "react"

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    
    const [ barStatus, setBarStatus ] = useState(false);
    const toggleBar = () => setBarStatus(prev => !prev);

    return(
        <SidebarContext.Provider value={{ barStatus, toggleBar }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => useContext(SidebarContext)