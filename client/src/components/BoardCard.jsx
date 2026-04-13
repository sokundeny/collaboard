import { useEffect, useState } from "react"
import colors from "../style/colors"
import FolderIcon from "./icons/FolderIcon"
import EmptyStarIcon from "./icons/EmptyStarIcon"
import FilledStarIcon from "./icons/FilledStarIcon"
import Avatar from "./Avatar"

const BoardCard = ({ isStarred, title, users = [], progress = 0, tasks = {}, others, onClick }) => {

    const [ starred, setStarred ] = useState(isStarred)
    const cardColors = colors.card

    useEffect(() => {
        setStarred(isStarred)
    }, []) 

    const handleToggleStar = () => setStarred(prev => !prev)
    
    return (
        <div className="shrink-0 w-80 p-4 rounded-2xl flex flex-col gap-2.5 
                      bg-card-background border border-card-border cursor-pointer"
            onClick={onClick}
        > 
            {/* HEADER */}
            <header className="w-full flex justify-between h-6">
                <FolderIcon color={cardColors.folder}/>
                <button onClick={handleToggleStar}>
                    {!starred ? (
                        <EmptyStarIcon color={cardColors.emptyStar} />
                    ) : (
                        <FilledStarIcon color={cardColors.filledStar} />
                    )}
                </button>
            </header>

            {/* TITLE */}
            <h3 className="font-semibold text-lg">{title}</h3>
            
            {/* AVATARS */}
            <div className="flex gap-1.5">
                {users.map((user, idx) => (
                    <Avatar
                        key={idx}
                        src={user.profile?.secure_url}
                        alt={user.name}
                    />
                ))}
                <div className="flex items-center px-0.5">
                    {/* <span className="text-card-textSecondary">+{others}</span> */}
                </div>
            </div>

            {/* TASK INFO */}
            <p className="text-card-textSecondary">
                {/* {tasks.total} tasks ‧ {tasks.inProgress} in progress */}
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-card-progressBg"
            >
                <div className="h-full rounded-full bg-card-progressFill"
                     style={{width: progress + "50%"}}>
                </div>            
            </div>
        </div>
    )
}

export default BoardCard