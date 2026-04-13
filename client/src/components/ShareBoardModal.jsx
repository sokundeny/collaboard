import { useState, useEffect } from "react"
import Avatar from "./Avatar"
import { inviteUser } from "../services/api"

const ShareBoardModal = ({ id,  boardMembers, active, onClose, onCreate }) => {

    const [ members, setMembers ] = useState([]);
    const [ toSearch, setToSearch ] = useState('')
    const [ boardId, setBoardId ] = useState(null)

    useEffect(() => {
        if (active) {
            setMembers(boardMembers);
            setBoardId(id)
        }
    }, [active, boardMembers]);

    if (!active) return null

    const handleInviteUser = async () => {
        try {
            const response = await inviteUser(boardId, toSearch, 'editor')
            console.log(response)
            setToSearch('')
            onClose()
        } catch (err) {
            console.error(err);
        }
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center text-white bg-zinc-800 
                        bg-opacity-70">
            <div className="bg-background-primary w-[720px] p-6 rounded-xl shadow-lg 
                            relative flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-brand-yellow">Share Board</h1>
                <div className="flex gap-4">
                    <input 
                        className={`px-4 py-2 flex-1 rounded bg-gray-800 text-white placeholder-gray-400 
                                border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                focus:border-gray-600 placeholder:text-sm border`}                    
                        type="text" 
                        name="Search" 
                        value={toSearch} 
                        placeholder={"Email or Name"}
                        onChange={(e) => setToSearch(e.target.value)}
                    />
                    <button 
                        onClick={handleInviteUser}
                        className="px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Invite
                    </button>

                </div>
                <div className="flex flex-col">
                    <div className="w-full h-8 border-b-2 border-b-gray-800 mt-2">
                        Members
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                        {members?.map((member, idx) => (
                            <div className="flex items-center gap-4">
                                <Avatar 
                                    src={member?.User?.UserProfile?.secure_url}
                                />
                                <div className="flex flex-col gap-1 text-slate-400">
                                    <p className="text-sm">{member.User.name}</p>
                                    <span className="text-xs">{member.User.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center space-x-2 mt-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareBoardModal