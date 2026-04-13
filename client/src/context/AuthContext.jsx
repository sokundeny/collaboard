import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom";

export const AuthContext= createContext();

export const AuthProvider= ({children}) => {
    const navigate=useNavigate()
    const [user,setUser]=useState(null);
    const [loadingToken,setLoadingToken]=useState(true)
    useEffect(()=>{
        const token=localStorage.getItem("token")
        if(token){
            try {
                const decode=jwtDecode(token)
                const currentTime = Date.now() / 1000;
                if (decode.exp < currentTime) {

                    localStorage.removeItem("token");
                    setUser(null);
                } else {
                    setUser(decode);
                }
            } catch (error) {
                localStorage.removeItem("token")
            }
        }
        setLoadingToken(false)
    },[])
    const logoutUser=()=>{
        localStorage.removeItem("token")
        setUser(null)
        navigate('/login')
    }
    const loginUser=(token)=>{
        localStorage.setItem("token",token)
        const decode=jwtDecode(token)
        setUser(decode)
    }
    return(
    <AuthContext.Provider value={{user,logoutUser,loginUser,loadingToken}}>
        {children}
    </AuthContext.Provider>
    )
}