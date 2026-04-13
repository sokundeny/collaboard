import { useEffect, useState } from "react"
import AuthenticatedLayout from "../layout/AuthenticatedLayout"
import CardDetailModal from "../components/CardDetailModal"
import { 
    getListsByBoardId,
    createList,
    getCardsByListId,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    getPersonalBoard
} from "../services/api"

const PersonalPage = () => {

    const [ boardData, setBoardData ] = useState(null)
    const [ lists, setLists ] = useState([])
    const [ showCardDetail, setShowCardDetail ] = useState(false)
    const [ activeListIndex, setActiveListIndex ] = useState(null)
    const [ activeCard, setActiveCard ] = useState(null)
    const [ isAddingList, setIsAddingList ] = useState(false)
    const [ isAddingCard, setIsAddingCard ] = useState(false)
    const [ newList, setNewList ] = useState('')
    const [ newCard, setNewCard ] = useState('')
    const [ modalActive, setModalActive ] = useState(false)
    const [ openMenuIndex, setOpenMenuIndex ] = useState(null)

    const fetchPersonalBoard = async () => {
        try {
            const data = await getPersonalBoard()
            setBoardData(data) 

            const lists = await getListsByBoardId(data.id);

            const listsWithCards = await Promise.all(
                lists.map(async (list) => {
                    const cards = await getCardsByListId(list.id);
                    return { ...list, tasks: cards, isCollapsed: false };
                })
            );

            setLists(listsWithCards);
        } catch (error) {
            console.error("Error fetching personal board and lists:", error)
        }
    }
    
    useEffect(() => {
        fetchPersonalBoard()
    }, [])

    const handleAddList = async () => {
        if (!newList.trim()) return;

        try {
            const created = await createList(boardData?.id, newList.trim());
            const lists = await getListsByBoardId(boardData?.id);
            const updatedLists = await Promise.all(
                lists.map(async (list) => {
                    const cards = await getCardsByListId(list.id);
                    return { ...list, tasks: cards };
                })
            );

            setLists(updatedLists);
            setNewList('');
            setIsAddingList(false);
        } catch (err) {
            console.error("Error creating list:", err);
        }
    };

    const handleDeleteList = async (id) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete this list?");
            if (!isConfirmed) return;

            const response = await deleteList(id)
            console.log(response)
            fetchPersonalBoard()
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddTask = async () => {
        if (!newCard.trim() || activeListIndex === null || !lists[activeListIndex]) return;

        const targetList = lists[activeListIndex];

        try {
            await createCard(
                targetList.id,
                newCard.trim()
            )

            const cards = await getCardsByListId(targetList.id);

            const updatedLists = [...lists];
            updatedLists[activeListIndex].tasks = cards;
            setLists(updatedLists);

            setNewCard('');
            setIsAddingCard(false);
            setActiveListIndex(null);
        } catch (err) {
            console.error("Failed to create card:", err);
        }
    }

    const handleUpdateCard = async (update) => {
        try {
            const response = await updateCard(activeCard.id, update)
            console.log(response)
            fetchPersonalBoard()
        } catch (Error) {
            console.error(Error);
            
        }

        setActiveCard(null)
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteCard(id)
            console.log(response)
            setShowCardDetail(false)
            fetchPersonalBoard()
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };
    
    return(
        <AuthenticatedLayout>
            <div className="p-4 flex gap-4 mt-20 h-full">
                {lists.map((list, idx) => (
                    <div 
                        className="w-72 h-fit p-2.5 bg-[#1F2432] rounded-xl shadow-md text-[#E2E8F0] flex flex-col 
                                gap-1.5"
                        key={list.id}
                    >
                        <div className="flex justify-between w-full">
                            <div className="h-8 px-2 text-sm font-semibold text-bran flex items-center">
                                <div className="relative">
                                    <input
                                        value={list.title}
                                        onChange={(e) => {
                                            const updatedLists = [...lists];
                                            updatedLists[idx].title = e.target.value;
                                            setLists(updatedLists);
                                        }}
                                        className="bg-transparent outline-none font-semibold text-sm cursor-pointer"
                                        // style={{ width: `${getTitleWidth(idx)}px` }}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <button 
                                    className="h-8 w-8 p-2 flex items-center justify-center 
                                            hover:bg-gray-600 rounded-lg"
                                    style={{
                                        backgroundColor: openMenuIndex === idx ? "#CBD5E1" : "",
                                        color: openMenuIndex === idx ? "#1F2937" : "#E2E8F0", 
                                    }}  
                                    onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                                >...
                                    {/* <MenuIcon /> */}
                                </button>

                                {openMenuIndex === idx && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#11151e] shadow-lg rounded-lg z-10 py-2 text-sm">
                                        <button 
                                            className="block w-full text-left text-[#F56565] hover:bg-[#1e2433] 
                                                        px-4 py-2 rounded"
                                            onClick={() => handleDeleteList(list.id)}    
                                        >
                                            Delete List
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            {list.tasks?.map((task, tIdx) => (
                                <button 
                                    key={tIdx}
                                    onClick={() => {
                                        setActiveCard(task); 
                                        setShowCardDetail(true)}
                                    } 
                                    className="text-sm text-[#B6C2CF] bg-[#2B3244] p-2 rounded-md mb-1 border 
                                            border-[#323B4C] hover:outline cursor-pointer flex">
                                    {task.title}
                                </button>
                            ))}

                            {(!isAddingCard || (isAddingCard && idx !== activeListIndex)) && (
                                <button 
                                    onClick={() => {
                                        setIsAddingCard(true);
                                        setIsAddingList(false);
                                        setNewCard('')
                                        setActiveListIndex(idx);
                                    }}
                                    className="h-8 w-full text-[#A0AEC0] hover:text-white px-2 py-1.5 flex items-center 
                                                text-sm font-medium hover:bg-[#2D3748] rounded-md"
                                >+ Add Card
                                </button>
                            )}

                            {isAddingCard && idx === activeListIndex && (
                                <div className="flex flex-col w-full gap-2">
                                    <textarea 
                                        className="p-2 bg-[#1A1F2A] text-[#CBD5E1] placeholder-slate-400 text-sm rounded-lg 
                                                    focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        type="text" 
                                        value={newCard}
                                        placeholder="Task Title"
                                        onChange={(e) => setNewCard(e.target.value)}
                                    />
                                    <div className="w-full flex gap-4">                                        
                                        <button
                                            onClick={handleAddTask}
                                            className="h-8 px-3 py-1.5 text-sm font-medium bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] rounded"
                                        >
                                            Add card
                                        </button>
                                        <button
                                            onClick={() => {setIsAddingCard(false)}}
                                            className="h-8 px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white/80 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>    
                ))}

                {isAddingList && (
                    <div className="w-72 p-2.5 h-fit bg-list-background rounded-xl shadow-lg flex flex-col gap-3"
                    >
                        <input
                            value={newList}
                            onChange={(e) => setNewList(e.target.value)}
                            // ref={inputRef}
                            type="text"
                            placeholder="Enter list title..."
                            className="h-10 px-3 rounded bg-slate-900 text-[#afabab] font-medium 
                                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
      
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddList}
                                className="h-8 px-3 py-1.5 text-sm font-medium bg-brand-yellow hover:bg-brand-yellow-hover text-black rounded"
                            >
                                Add list
                            </button>
                            <button
                                onClick={() => setIsAddingList(false)}
                                className="h-8 px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white/80 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {!isAddingList && (
                    <button
                        onClick={() => {
                            setIsAddingList(true); 
                            setIsAddingCard(false)}}
                        className="w-72 h-12 p-3 bg-[#e5e5e55f] rounded-xl text-[#afb3b8] font-medium 
                                flex gap-1.5 items-center hover:bg-[#c9c9c950]"
                    >
                        <p className="text-lg">+</p> Add a list
                    </button>
                )}
                <CardDetailModal
                    active={showCardDetail}
                    onClose={() => setShowCardDetail(false)}
                    onSave={(update) => handleUpdateCard(update)}
                    onDelete={(id) => handleDelete(id)}
                    card={activeCard}
                    personal={true}
                />
            </div>
        </AuthenticatedLayout>
    )
}

export default PersonalPage