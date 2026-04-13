

const SearchIcon = ({ color = "currentColor", style = {} }) => {

    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
            style={style}
        >
            <path 
                fill="none" 
                stroke={color} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"
            />
        </svg>
    )
}

export default SearchIcon