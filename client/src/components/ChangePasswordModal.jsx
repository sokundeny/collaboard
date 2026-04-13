import { useState } from "react";
import Modal from "./Modal";
import { changePassword } from "../services/api";

const ChangePasswordModal = ({ active, onClose,onSubmitChange}) => {

    const [ newPassword, setNewPassword ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = async () => {
        setNewPassword('')
        setPassword('')
        onSubmitChange(password,newPassword);
        
    };

    return(
        <Modal 
            active={active}
            width={720}
        >
            <h2 className="text-2xl font-bold text-brand-yellow">Change Password</h2>
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`px-4 py-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 
                        border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:border-gray-600 placeholder:text-sm border`}
            />
            
            <input
                type="password"
                placeholder="Current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`px-4 py-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 
                        border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:border-gray-600 placeholder:text-sm border`}  
            />

            

            <div className="flex justify-between items-center space-x-2 mt-6">
                <button
                    onClick={() => onClose()}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Close
                </button>
                <button 
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create
                </button>

                    
            </div>
        </Modal>
    )
}

export default ChangePasswordModal