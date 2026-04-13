import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { 
    getBoardById,
    getListsByBoardId,
    createList,
    getCardsByListId,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard
} from "../services/api"
import BoardHeader from "../components/BoardHeader"
import MenuIcon from "../components/icons/MenuIcon"
import ShareBoardModal from "../components/ShareBoardModal"
import CardDetailModal from "../components/CardDetailModal"
import {io} from 'socket.io-client'

const socket = io('http://localhost:4000',{autoConnect:false})


const BoardView = () => {

    const { id } = useParams()
    const [ board, setBoard ] = useState({})
    const [ boardLists, setBoardLists ] = useState([])
    const [ showCardDetail, setShowCardDetail ] = useState(false)
    const [ activeListIndex, setActiveListIndex ] = useState(null)
    const [ activeCard, setActiveCard ] = useState(null)
    const [ isAddingList, setIsAddingList ] = useState(false)
    const [ isAddingCard, setIsAddingCard ] = useState(false)
    const [ newList, setNewList ] = useState('')
    const [ newCard, setNewCard ] = useState('')
    const [ modalActive, setModalActive ] = useState(false)
    const [ openMenuIndex, setOpenMenuIndex ] = useState(null)

    const spanRefs = useRef({});
    const inputRef = useRef(null);

    const boardId = id;


    const fetchBoardData = async () => {
            try {
                const boardData = await getBoardById(id);
                setBoard(boardData);

                const lists = await getListsByBoardId(id);

                const listsWithCards = await Promise.all(
                    lists.map(async (list) => {
                        const cards = await getCardsByListId(list.id);
                        return { ...list, tasks: cards, isCollapsed: false };
                    })
                );
                console.log(listsWithCards)

                setBoardLists(listsWithCards);
            } catch (error) {
                console.error("Error fetching board data:", error);
            }
        }

    useEffect(() => {

        fetchBoardData();

        const refreshHandler = () =>{
            fetchBoardData();
        }

        socket.connect();
        socket.emit('joinBoard',id);
        
        socket.on('refreshBoard',refreshHandler);

        return ()=>{
        socket.off('refreshBoard',refreshHandler)
        socket.disconnect();
        }
    }, [id]);

    const getTitleWidth = (idx) => {
        const span = spanRefs.current[idx];
        if (span) {
            return span.offsetWidth + 4;
        }
        return 50;
    }

    const handleAddList = async () => {
        if (!newList.trim()) return;

        try {
            const created = await createList(id, newList.trim());
            const lists = await getListsByBoardId(id);
            const updatedLists = await Promise.all(
                lists.map(async (list) => {
                    const cards = await getCardsByListId(list.id);
                    return { ...list, tasks: cards };
                })
            );

            setBoardLists(updatedLists);
            setNewList('');
            setIsAddingList(false);
            socket.emit('boardChanged',{boardId:id});
            console.log("something happen");
            
        } catch (err) {
            console.error("Error creating list:", err);
        }
    };

    const handleDeleteList = async (Id) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete this list?");
            if (!isConfirmed) return;

            const response = await deleteList(Id)
            setBoardLists(prev => prev.filter(list => list.id !== Id));
            socket.emit('boardChanged',{boardId:id});
            setOpenMenuIndex(null)
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddTask = async () => {
        if (!newCard.trim() || activeListIndex === null || !boardLists[activeListIndex]) return;

        const targetList = boardLists[activeListIndex];

        try {
            await createCard(
                targetList.id,
                newCard.trim()
            )

            const cards = await getCardsByListId(targetList.id);

            const updatedLists = [...boardLists];
            updatedLists[activeListIndex].tasks = cards;
            setBoardLists(updatedLists);

            setNewCard('');
            setIsAddingCard(false);
            setActiveListIndex(null);
            socket.emit('boardChanged',{boardId:id});
        } catch (err) {
            console.error("Failed to create card:", err);
        }
    }

    const handleUpdateCard = async (update) => {
        try {
            const response = await updateCard(activeCard.id, update)
            console.log(response)
            fetchBoardData()
        } catch (Error) {
            console.error(Error);
            
        }

        setActiveCard(null)
        socket.emit('boardChanged',{boardId:id});
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteCard(id)
            console.log(response)
            setShowCardDetail(false)
            socket.emit('boardChanged',{boardId:id});

            // fetchPersonalBoard()
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    const handleClickShare = () => {
        setModalActive(true)
    } 

    {/* bg-[#8B5CF6] Purple Color */}
    return (
        <div className="bg-background-primary">
            <div className="h-screen flex flex-col">
                <BoardHeader 
                    id={id}
                    title={board.title} 
                    share={handleClickShare}
                    members={board.BoardMembers}
                    favorite={board.favorite}
                    socket = {socket}
                />

                <div className="p-4 flex gap-4 h-full">
                    {boardLists.map((list, idx) => (
                        
                        // LIST MUY MUY
                        <div 
                            className="w-72 h-fit p-2.5 bg-[#1F2432] rounded-xl shadow-md text-[#E2E8F0] flex flex-col 
                                        gap-1.5"
                            key={list.id} 
                        >
                            {/* LIST HEADER */}
                            <div className="flex justify-between w-full">
                                {/* <div className="h-8 px-2 text-sm font-semibold text-bran flex items-center">
                                    {list.title}
                                </div> */}

                                <div className="h-8 px-2 text-sm font-semibold text-bran flex items-center">
                                    <div className="relative">
                                        <span
                                            ref={(el) => (spanRefs.current[idx] = el)}
                                            className="absolute invisible whitespace-pre"
                                            style={{ font: "inherit", padding: "0 2px" }}
                                        >
                                            {list.title}
                                        </span>

                                        <input
                                            value={list.title}
                                            onChange={(e) => {
                                                const updatedLists = [...boardLists];
                                                updatedLists[idx].title = e.target.value;
                                                setBoardLists(updatedLists);
                                            }}
                                            className="bg-transparent outline-none font-semibold text-sm cursor-pointer"
                                            style={{ width: `${getTitleWidth(idx)}px` }}
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
                                    >
                                        <MenuIcon />
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

                            {/* LIST BODY */}
                            <div className="w-full flex flex-col gap-1">

                                {/* TASK CARDS */}
                                {list.tasks?.map((task, tIdx) => (
                                    <button 
                                        key={tIdx}
                                        onClick={() => {
                                            setActiveCard(task); 
                                            setShowCardDetail(true)}
                                        } 
                                        className="text-sm text-[#a8b6c8] bg-[#161a23] p-2 rounded-md mb-1 border 
                                                border-[#323B4C] hover:outline cursor-pointer flex items-center gap-2">
                                        {(task.status === "done") ? (
                                        <div>
                                            <div className="h-4 w-4 bg-green-600 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l5 5L20 7"/></svg>
                                            </div>
                                        </div> ) : (<div></div>)} 
                                        {task.title}
                                    </button>
                                ))}

                                {/* START TO ADD NEW CARD BUTTON  */}
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

                                {/* ADD NEW CARD BUTTON */}
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
                                ref={inputRef}
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
                </div>
            </div>
            <ShareBoardModal 
                id={id}
                boardMembers={board.BoardMembers}
                active={modalActive}
                onClose={() => setModalActive(false)}
            />

            <CardDetailModal
                active={showCardDetail}
                onClose={() => setShowCardDetail(false)}
                onSave={(update) => handleUpdateCard(update)}
                onDelete={(id) => handleDelete(id)}
                card={activeCard}
                members={board.BoardMembers}
            />
        </div>
    )
}

export default BoardView