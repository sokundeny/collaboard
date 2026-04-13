import { useEffect, useState } from "react";

const CreateBoardModal = ({ active, onClose, onCreate }) => {
    
    const [ title, setTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ placeholder, setPlaceholder ] = useState('')
    const [ visibility, setVisibility ] = useState('private')

    if (!active) return null

    const handleCreate = () => {
        if (title === '') setPlaceholder("Title Mustn't be empty")
        alert(title + description + visibility)
 
        setTitle('')
        onCreate(title, description, visibility)
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center text-white bg-zinc-800 
                        bg-opacity-70">
            <div className="bg-background-primary w-[1080px] p-6 rounded-xl shadow-lg 
                            relative flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-brand-yellow">Create a new board</h1>

                <div>
                    <div className="h-0.5 w-full bg-slate-800 rounded-full"></div>
                    <p className="italic text-gray-500">Required fields are marked with an asterisk (*).</p>
                </div>

                {/* BOARD TITLE */}
                <div className="flex flex-col gap-2">
                    <label 
                        className="text-base font-medium text-white"
                        htmlFor="Title"
                    >Title <span className="text-red-500">*</span>
                    </label>

                    <input 
                        className={`px-4 py-2 w-1/2 rounded bg-gray-800 text-white placeholder-gray-400 
                                border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${title.length === 0 ? 'border-red-500' : ''} focus:border-gray-600
                                placeholder:text-red-500 placeholder:text-sm border`}                    
                        type="text" 
                        name="Title" 
                        value={title} 
                        placeholder={placeholder}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                    </input>
                </div>

                <div className="flex flex-col gap-2">
                    <label 
                        className="text-base font-medium text-white"
                        htmlFor="Title"
                    >Description
                    </label>

                    <input 
                        className={`px-4 py-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 
                                border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                focus:border-gray-600 placeholder:text-sm border`}                    
                        type="text" 
                        name="Title" 
                        value={description} 
                        placeholder="description"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </input>
                </div>

                <div className="h-[1px] w-full bg-slate-800 rounded-full"></div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-white">
                        Visibility <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={visibility === "public"}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="form-radio h-4 w-4 text-blue-500 bg-gray-800 border-gray-600"
                        />
                        <span className="text-white">Public</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={visibility === "private"}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="form-radio h-4 w-4 text-blue-500 bg-gray-800 border-gray-600"
                        />
                        <span className="text-white">Private</span>
                        </label>
                    </div>
                </div>


                <div className="flex justify-between items-center space-x-2 mt-6">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleCreate}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create
                    </button>

                    
                </div>
            </div>
        </div>
    );
};

export default CreateBoardModal;
