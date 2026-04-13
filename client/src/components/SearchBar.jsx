import SearchIcon from "./icons/SearchIcon"
import colors from "../style/colors"

const SearchBar = () => {
    return(
        <div 
            className="h-9 w-[720px] rounded-xl px-3 py-2 text-white
                    bg-searchBar-background border border-searchBar-border
                    flex items-center gap-2"
            // placeholder="Search"
        >
            <SearchIcon color={colors.searchBar.placeHolderText}/>
            <input 
                className="w-full h-full bg-transparent border-none outline-none 
                            focus:outline-none placeholder:text-searchBar-placeHolderText"
                type="text" 
                placeholder="Search"
            />
        </div>

    )
}

export default SearchBar