import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Avatar from "./Avatar";
import { assignCard, removeCardAssignment, deleteCard } from "../services/api";
import Avatar3 from "../assets/avatars/avatar3.png";

const CardDetailModal = ({ active, onClose, card, onSave, onDelete, members, personal = false }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [boardMembers, setBoardMembers] = useState([]);
    const [assignedMemberIds, setAssignedMemberIds] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState('To Do');

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const spanRef = useRef(null);

    const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (active && card) {
            setBoardMembers(members);
            setTitle(card.title || '');
            setDescription(card.description || '');
            setAssignedUser(card.assignedUser || '');
            setStartTime(formatDateTimeLocal(card.start_at));
            setEndTime(formatDateTimeLocal(card.due_at));
            setStatus(card.status || 'To Do');
            setAssignedMemberIds(card.CardAssignments.map(a => a.user_id));
        }
    }, [active, card, members]);

    useEffect(() => {
        if (spanRef.current) {
            const newWidth = spanRef.current.offsetWidth + (isEditingTitle ? 28 : 4);
            setInputWidth(newWidth);
        }
    }, [title, isEditingTitle]);

    const handleAssign = async (userId) => {
        try {
            await assignCard(card.id, userId);
            setAssignedMemberIds(prev => [...prev, userId]);
            setShowDropdown(false);
        } catch (err) {
            console.error("Error assigning user:", err);
        }
    };

    const handleRemove = async (userId) => {
        try {
            await removeCardAssignment(card.id, userId);
            setAssignedMemberIds(prev => prev.filter(id => id !== userId));
        } catch (error) {
            console.error("Error removing assignment:", error);
        }
    };
 
    const handleSave = async () => {
        const updatedCard = {
            ...card,
            title,
            description,
            assignedUser,
            start_at: startTime,
            due_at: endTime,
            status,
        };

        await onSave(updatedCard);
        onClose();
    };

    const handleDelete = () => {
        onDelete(card.id)
    };

    const getMemberProfile = (userId) =>
        boardMembers.find(m => m.User?.id === userId);

    const unassignedMembers = boardMembers?.filter(m => !assignedMemberIds.includes(m.User?.id));

    if (!active) return null;

    return (
        <Modal active={active}>
            <div
                className={`font-bold text-2xl px-2 py-1 rounded-md relative w-fit
                            hover:${isEditingTitle ? '' : 'bg-slate-700'} flex items-center`}
            >
                <span
                    ref={spanRef}
                    className="absolute invisible whitespace-pre"
                    style={{ font: "inherit", padding: "0 2px" }}
                >
                    {title || ''}
                </span>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setIsEditingTitle(true)}
                    onBlur={() => setIsEditingTitle(false)}
                    className={`bg-transparent outline-none transition-all duration-150 
                                ${isEditingTitle ? 'border px-4 rounded bg-[#0b171f] text-[#afabab]' 
                                                 : 'cursor-pointer text-brand-yellow'} font-bold text-2xl`}
                    style={{ width: `${inputWidth}px` }}
                    placeholder="Card Title"
                />
            </div>

            {!personal &&             
                <div className="ml-4 space-y-2 mt-4">
                    <h1 className="text-gray-400">Assigned Members</h1>
                    <div className="flex items-center gap-2 relative">
                        {assignedMemberIds.map(userId => {
                            const member = getMemberProfile(userId);
                            return (
                                <div
                                    key={userId}
                                    onClick={() => handleRemove(userId)}
                                    className="cursor-pointer"
                                    title="Click to remove"
                                >
                                    <Avatar
                                        src={member?.User?.UserProfile?.secure_url || Avatar3}
                                        size={40}
                                    />
                                </div>
                            );
                        })}

                        <button
                            className="h-10 w-10 bg-card-background text-2xl rounded-full flex items-center justify-center"
                            onClick={() => setShowDropdown(prev => !prev)}
                        > + </button>

                        {showDropdown && (
                            <div className="absolute top-12 left-0 z-50 bg-[#1e1e1e] border border-gray-700 rounded shadow-md w-60 max-h-64 overflow-auto">
                                {unassignedMembers.length === 0 && (
                                    <div className="p-2 text-sm text-gray-400">No available members</div>
                                )}
                                {unassignedMembers.map(member => (
                                    <div
                                        key={member.User?.id}
                                        onClick={() => handleAssign(member.User?.id)}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer"
                                    >
                                        <Avatar
                                            src={member.User?.UserProfile?.secure_url || Avatar3}
                                            size={32}
                                        />
                                        <div className="text-sm text-white">{member.User?.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            }

            <div className="flex flex-col gap-2 mt-4">
                <label>Description</label>
                <textarea
                    className="bg-gray-800 p-2 rounded text-white border border-gray-700"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label>Schedule</label>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400">Start</span>
                        <input
                            type="datetime-local"
                            className="bg-gray-800 p-2 rounded text-white border border-gray-700"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />                    
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400">End</span>
                        <input
                            type="datetime-local"
                            className="bg-gray-800 p-2 rounded text-white border border-gray-700"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label>Status</label>
                <select
                    className="bg-gray-800 p-2 rounded text-white border border-gray-700"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="to-do">To Do</option>
                    {/* <option value="In Progress">In Progress</option> */}
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="flex justify-between mt-6">
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-white"
                    >
                        Delete
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 font-medium bg-brand-yellow hover:bg-brand-yellow-hover text-[#11151E] rounded"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default CardDetailModal;
