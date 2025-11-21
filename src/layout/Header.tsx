import { useEffect } from "react";
import Menu from "../blocks/Menu";
import { Link } from "react-router-dom";
import { MenuProps } from "../types/MenuProps";
import logo from "@/assets/images/logo.svg";
import menuToggleLogo from "@/assets/images/menu.svg";
import Search from "../blocks/Search";
import { isMobile, isTablet } from "react-device-detect";
import searchIcon from "../assets/images/search-icon.svg";
const Header: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
  useEffect(() => {
    const header = document.getElementById("header");
    const lateral_menu = document.getElementById("lateral-menu");
    document.addEventListener("scroll", (e) => {
      if (window.scrollY > 0) {
        header?.classList.add("fixed");
        lateral_menu?.classList.add("small");
      }
      if (window.scrollY <= 1) {
        header?.classList.remove("fixed");
        lateral_menu?.classList.remove("small");
      }
    });
  }, []);
  return (
    <header id="header">
      <div className="header-container container m-auto flex justify-between pt-4 lg:pt-8 pb-4">
        <div id="logo" className="w-[80px] ml-2">
          <Link to="/">
            <img src={logo} width="80px" height="141px" alt="logo" />
          </Link>
        </div>
        <div className="menu">
          <Menu isActive={props.isActive} setActive={props.setActive} />
        </div>
        {isMobile && (
          <div className="flex">
            <Link
              to="#"
              className="mt-10 mr-2"
              id="search-toggle"
              onClick={(e) => {
                e.preventDefault();
                let search_block = document.getElementById("search-block");
                search_block?.classList.remove("-top-[141px]");
                search_block?.classList.add("top-0");
              }}
            >
              <img src={searchIcon} width={32} height={32} />
            </Link>
            <div
              id="lateral-menu-toggle"
              className="mt-10 mr-2 lg:hidden"
              onClick={() => props.setActive(!props.isActive)}
            >
              <img
                src={menuToggleLogo}
                width="32px"
                height="32px"
                alt="menu-toggle"
              />
            </div>
          </div>
        )}
        <Search />
      </div>
    </header>
  );
};

export default Header;
