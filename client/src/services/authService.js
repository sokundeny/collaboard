import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const loginApi=async(user)=>{
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email:user.email,password:user.password});
    return res.data;
}

export const registerApi=async(user)=>{
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { email:user.email,name:user.name,password:user.password});
    return res.data;
}