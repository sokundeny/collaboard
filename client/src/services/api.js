import axios from "axios"
import axiosInstance from "./axiosInstance";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const ping = async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
}

export const getPersonalBoard = async () => {
    const response = await axiosInstance.get('/board/user/personal')
    return response.data
}

export const getBoards = async () => {
    const response = await axiosInstance.get(`/board`);
    return response.data;
}

export const getBoardById = async (id) => {
    const response = await axiosInstance.get(`/board/${id}`)
    return response.data
}

export const createBoards = async (title, description, visibility) => {
    const payload = {
        title,
        description,
        visibility
    }

    const response = await axiosInstance.post('/board', payload)
    return response.data
}

export const updateBoard = async (id, updates) => {
    const response = await axiosInstance.put(`/board/${id}`, updates);
    return response.data;
};

export const deleteBoard = async (id) => {
    const response = await axiosInstance.delete(`/board/${id}`);
    return response.data;
};

export const getListsByBoardId = async (board_id) => {
    const response = await axiosInstance.get(`/board/${board_id}/list`);
    return response.data;
};

export const createList = async (board_id, title) => {
    const payload = {
        board_id, 
        title
    }

    const response = await axiosInstance.post('/list', payload)
    return response.data
}

export const deleteList = async (id) => {
    const response = await axiosInstance.delete(`/list/${id}`);
    return response.data;
};

export const updateList = async (id, updates) => {
    const response = await axiosInstance.put(`/list/${id}`, updates);
    return response.data;
};

export const getCardsByListId = async (list_id) => {
    const response = await axiosInstance.get(`/list/${list_id}/card`);
    return response.data;
};

export const createCard = async (list_id, title, description = "", status = "to-do", start_at = null, due_at = null) => {
    const payload = { 
        list_id, 
        title, 
        description, 
        status, 
        start_at, 
        due_at 
    };
    const response = await axiosInstance.post('/card', payload);
    return response.data;
};

export const updateCard = async (id, updates) => {
    const response = await axiosInstance.put(`/card/${id}`, updates);
    return response.data;
};

export const deleteCard = async (id) => {
    const response = await axiosInstance.delete(`/card/${id}`);
    return response.data;
};

export const assignCard = async (card_id, user_id) => {
    const response = await axiosInstance.post(`/card/assign/${card_id}`, { user_id });
    return response.data;
};

export const removeCardAssignment = async (card_id, user_id) => {
    const response = await axiosInstance.delete(`/card/remove/${card_id}`, {
        data: { user_id },
    });
    return response.data;
};

export const inviteUser = async (id, invitedUser, role) => {
    const payload = {
        invitedUser,
        role
    }
    const response = await axiosInstance.post(`/board/${id}/invite`, payload);
    return response.data;
}

export const getUserProfile = async () => {

    const response = await axiosInstance.get('/profile')
    return response.data
}

export const uploadProfileAvatar = async (public_id, secure_url) => {

    const payload = {
        public_id,
        secure_url
    }

    const response = await axiosInstance.post('/profile/upload', payload)
    return response.data
}
export const changePassword =  async (password,newPassword) =>{
    const currentPassword =password
    const payload={
        currentPassword,
        newPassword
    }
    const response = await axiosInstance.patch('/user/password',payload)
    return response.data;
}
export const changeEmail =  async (currentPassword,newEmail)=>{

    const payload = {
        currentPassword,
        newEmail
    }
    const response = await axiosInstance.patch("/user/email",payload)
    if(response){
        localStorage.removeItem("token");
        localStorage.setItem("token",response.data.token);
    }
    return response.data;
}
export const changeName = async (currentPassword,newUsername) =>{
    const payload ={
        currentPassword,
        newUsername
    }
    const response = await axiosInstance.patch("/user/username",payload);
    if(response){
        localStorage.removeItem('token')
        localStorage.setItem('token',response.data.token);
    }
    return response.data;
}