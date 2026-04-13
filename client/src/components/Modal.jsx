
const Modal = ({ active, children, width = 1080 }) => {

    if (!active) return null

    return(
        <div className="fixed inset-0 z-40 flex items-center justify-center text-white bg-zinc-800 
                        bg-opacity-70">
                <div className={`bg-background-primary w-[${width}px] p-6 rounded-xl shadow-lg 
                                relative flex flex-col gap-4`}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal