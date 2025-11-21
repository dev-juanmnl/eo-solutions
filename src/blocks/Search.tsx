import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { useRef } from "react";
import searchIcon from "../assets/images/search-icon.svg";

const Search = () => {
  const globalCtx = useContext(GlobalContext);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeSearch = () => {
    const searchBlock = document.getElementById("search-block");
    searchBlock?.classList.add("-top-[141px]");
    searchBlock?.classList.remove("top-0");
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const search = searchRef.current?.value;
    if (search) {
      window.location.href = `/en/search?keywords=${search}`;
    }
    closeSearch();
    if (searchRef.current !== null) searchRef.current.value = "";
  };
  return (
    <form
      id="search-block"
      action="#"
      className="search-container absolute w-full bg-white pt-10 pb-10 px-10 -top-[141px] z-[9999] transition-all duration-500 ease-in-out delay-0 left-0 flex border-b border-b-neutral-200"
    >
      <input
        ref={searchRef}
        type="text"
        placeholder="Search"
        className="search h-14 p-2 border border-gray-300 rounded-full w-full mr-2 text-xl"
        id="search-input"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
      />
      <a href="#" onClick={(e) => handleSubmit(e)}>
        <img src={searchIcon} width="53px" height="53px" />
      </a>
      <span
        id="search-close"
        onClick={closeSearch}
        className="absolute top-1 right-1 cursor-pointer border-full bg-gray-600 px-[11px] py-1 font-black text-white rounded-full text-center"
      >
        X
      </span>
    </form>
  );
};

export default Search;
