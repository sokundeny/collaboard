import AuthenticatedLayout from "../layout/AuthenticatedLayout"
import { getBoards } from "../services/api"
import { useEffect, useState } from "react"
const HomePage = () => {

    const [ boards, setBoards ] = useState()

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
    }, [])
    
    return (
        <AuthenticatedLayout>
            <div className="p-6 text-white space-y-8 mt-20">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                    <p className="text-gray-400 text-sm">Here’s what’s happening today.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#2b2b2b] rounded-2xl p-4">
                        <p className="text-gray-400 text-sm">Total Boards</p>
                        <p className="text-xl font-semibold mt-1">{boards?.length}</p>
                    </div>                    
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default HomePage