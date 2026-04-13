import AuthenticatedLayout from "../layout/AuthenticatedLayout"
import BoardCard from "../components/BoardCard"
import ArrowRightIcon from "../components/icons/ArrowRightIcon"
import CreateBoardModal from "../components/CreateBoardModal"
import { getBoards, createBoards } from "../services/api"

import ChillGuy from "../assets/avatars/ChillGuy.jpg"
import Nero from "../assets/avatars/Nero.jpg"
import Chopper from "../assets/avatars/Chopper.jpg"
import Avatar1 from "../assets/avatars/avatar1.png"
import Avatar2 from "../assets/avatars/avatar2.png"
import Avatar3 from "../assets/avatars/avatar3.png"
import Avatar4 from "../assets/avatars/avatar4.jpg"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// const dummyData = [
	// {
	// 	title: "Marketing Strategy",
	// 	isStarred: true,
	// 	progress: 60,
	// 	tasks: {
	// 		total: 10,
	// 		inProgress: 3,
	// 	},
	// 	users: [
	// 		{ name: "Alice", avatar: ChillGuy },
	// 		{ name: "Bob", avatar: Nero },
	// 	],
	// 	others: 3,
	// },
	// {
	// 	title: "UI Revamp",
	// 	isStarred: false,
	// 	progress: 40,
	// 	tasks: {
	// 		total: 15,
	// 		inProgress: 5,
	// 	},
	// 	users: [
	// 		{ name: "Carol", avatar: Chopper },
	// 		{ name: "Alice", avatar: Avatar1 },
	// 	],
	// 	others: 1,
	// },
	// {
	// 	title: "Product Launch",
	// 	isStarred: true,
	// 	progress: 80,
	// 	tasks: {
	// 		total: 20,
	// 		inProgress: 2,
	// 	},
	// 	users: [
	// 		{ name: "Nero", avatar: Avatar3 },
	// 		{ name: "Bob", avatar: Avatar2 },
	// 	],
	// 	others: 4,
	// },
	// {
	// 	title: "Team Onboarding",
	// 	isStarred: false,
	// 	progress: 25,
	// 	tasks: {
	// 		total: 8,
	// 		inProgress: 4,
	// 	},
	// 	users: [
	// 		{ name: "Luna", avatar: Nero },
	// 		{ name: "Carol", avatar: Avatar4 },
	// 	],
	// 		others: 2,
	// },
// ];

const BoardsPage = () => {
	const [ boards, setBoards ] = useState([])
	const [ modalActive, setModalActive ] = useState(false)
	const [reload,setReload] = useState(false);
	const navigate = useNavigate()

	const fetchBoards = async () => {
		try {
			const data = await getBoards()
			console.log(data)
			
			// const enrichedBoards = data.map(board => ({
			// 	id: board.board_id,
			// 	title: board.Board.title,
			// 	isStarred: board.Board.favorite,
			// 	progress: 70,
			// 	tasks: {
			// 		total: 10,
			// 		inProgress: 12
			// 	},
			// 	users: [
			// 		{ name: "Luna", avatar: Nero },
			// 		{ name: "Carol", avatar: Avatar4 },
			// 	],
			// 	others: 2
			// }));

			setBoards(data);
		} catch (err) {
			console.error(err);	
		}
	}

	useEffect(() => {
		fetchBoards();
	}, [reload])

	const handleCreateBoard = async (title, description, visibility) => {
		try {
			const response = await createBoards(title, description, visibility)
			console.log(response)
			setReload(prev =>!prev);
			setModalActive(false)
		} catch(err) {
			console.error(err);
		}
	}

	const handleBoardClick = (board_id) => {
		navigate(`/board/${board_id}`)
	}

    return(
        <AuthenticatedLayout>
            <div className="mt-20 px-6 py-6 flex flex-col gap-6">
                
                {/* FOR BOARD TITLE AND SUB-TEXT*/}
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-1">
						<h1 className="text-white font-bold text-2xl">Boards</h1>
						<p className="text-[#9CA3AF] font-medium text-sm">
							Boards you're part of, shared with you, or owned by you.
						</p>
					</div>
					<button 
						className="font-semibold px-4 py-2 rounded-md transition
								bg-brand-yellow hover:bg-[#e2950d] text-[#161B27]"
						onClick={() => setModalActive(true)}
					>
						+ Create Board
					</button>
				</div>

                {/* STARRED BOARDS */}
                {/* <div className="py-2 flex flex-col gap-4">
                    <h1 className="text-[#E5E5E5] font-semibold text-xl">Starred Boards</h1>
                    <div className="flex items-center gap-4">
						<div className="flex gap-6 text-white overflow-x-auto scrollbar-hidden items-center
										group w-full"
                    	>
							{boards.map((data, idx) => (
								<BoardCard 
									key={idx}
									isStarred={data.isStarred}
									title={data.title}
									users={data.users}
									progress={data.progress}
									tasks={data.tasks}
									others={data.others}
								/>
							))}
							<div className="h-8 w-8 bg-slate-600 rounded-full hidden group-hover:flex
											group-hover:justify-center group-hover:items-center"
							>
								<ArrowRightIcon />
							</div>
						</div>
					</div>
                </div> */}

				{/* RECENTLY VIEWED BOARDS */}
                {/* <div className="py-2 flex flex-col gap-4">
                    <h1 className="text-[#E5E5E5] font-semibold text-xl">Recently Viewed Boards</h1>
                    <div className="flex gap-6 text-white overflow-x-auto scrollbar-hidden"
                    >
                        {boards.map((data, idx) => (
                            <BoardCard 
                                key={idx}
                                isStarred={data.isStarred}
                                title={data.title}
                                users={data.users}
                                progress={data.progress}
                                tasks={data.tasks}
                                others={data.others}
                            />
                        ))}
                    </div>
                </div> */}

				{/* YOUR WORKSPACES */}
                <div className="py-2 flex flex-col gap-4">
                    <h1 className="text-[#E5E5E5] font-semibold text-xl">Your Workspaces</h1>
                    <div className="flex gap-6 text-white overflow-x-auto scrollbar-hidden"
                    >
                        {boards.map((data) => (
                            <BoardCard 
								key={data.id}
                                isStarred={data.favorite}
                                title={data.title}
                                users={data.members}
                                progress={data.progress}
                                tasks={data.tasks}
                                others={data.others}
								onClick={() => handleBoardClick(data.id)}
                            />
                        ))}
                    </div>
                </div>
			</div>

			<CreateBoardModal 
				active={modalActive}
				onClose={() => setModalActive(false)}
				onCreate={(title, description, visibility) => handleCreateBoard(title, description, visibility)}
			/>
        </AuthenticatedLayout>
    )
}

export default BoardsPage