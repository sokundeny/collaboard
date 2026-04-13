
const MenuIcon = ({color = "currentColor", style = {}}) => {
    
    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
            style={style}
        >
            <g 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="1"/>
                <circle cx="6" cy="12" r="1"/>
                <circle cx="18" cy="12" r="1"/>
            </g>
        </svg>
    )
}

export default MenuIcon