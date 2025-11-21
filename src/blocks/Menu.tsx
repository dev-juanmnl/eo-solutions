import { Link } from "react-router-dom";
import { MenuProps } from "../types/MenuProps";
import { GlobalContext } from "../context/Global";
import { useContext, useEffect, useState } from "react";
import { MenuItemType } from "../types/MenuItemType";
import SearchIcon from "../assets/images/search-icon.svg";
const Menu: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
  const globalCtx = useContext(GlobalContext);
  const [menu, setMenu] = useState<MenuItemType[]>([]);
  const changeLanguage = (e: any, value: any) => {
    e.preventDefault();
    let lng_screen = document.getElementById("language-screen");
    lng_screen?.classList.add("active");
    setTimeout(() => {
      lng_screen?.classList.remove("active");
    }, 2000);
    if (value === "Fr") {
      globalCtx?.changeLanguage("En");
    } else if (value === "En") {
      globalCtx?.changeLanguage("Fr");
    }
    sessionStorage.setItem("lang", value);
  };
  const load = async () => {
    try {
      setTimeout(() => {
        if (sessionStorage.getItem("menu_items") !== null) {
          let response = JSON.parse(sessionStorage.getItem("menu_items")!);
          let menu: MenuItemType[] = [];
          response.data.data.forEach((item: any) => {
            let active = false;
            if (item.attributes.url === window.location.pathname) active = true;
            let menu_item: MenuItemType = {
              id: item.id,
              name: item.attributes.title,
              url: item.attributes.url,
              sub_menu: [],
              active: active,
            };
            if (item.attributes.parent === "") {
              menu.push(menu_item);
            } else {
              //search in the temporary menu the parent and assign it
              menu.forEach((item2) => {
                if (item2.id === item.attributes.parent) {
                  item2.sub_menu.push(menu_item);
                }
              });
            }
          });
          setMenu(menu);
        }
      }, 2000);
    } catch (error) {}
  };
  useEffect(() => {
    load();
  }, [globalCtx?.global, globalCtx?.menuLoaded]);
  return (
    <ul className="flex text-base xl:text-lg pr-14" id="main-menu">
      {menu.map((menu_item: MenuItemType, i) => (
        <li
          className={
            menu_item.active
              ? "duration-300 menu-item active"
              : "duration-300 menu-item"
          }
          key={`menu-item-${i}`}
        >
          <Link to={menu_item.url}>{menu_item.name}</Link>
          {menu_item.sub_menu.length > 0 ? (
            <div className="sub-menu absolute bottom-0 w-[200px] h-[0px] overflow-hidden">
              <ul className="relative w-full">
                {menu_item.sub_menu.map((sub_menu_item: MenuItemType, i2) => (
                  <li className="w-full" key={`menu-item-${i2}`}>
                    <Link to={sub_menu_item.url} className="w-full">
                      {sub_menu_item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
      <li>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            let search_block = document.getElementById("search-block");
            search_block?.classList.remove("-top-[141px]");
            search_block?.classList.add("top-0");
          }}
        >
          <img src={SearchIcon} width={32} height={32} />
        </Link>
      </li>
      {/* <li className="border-l-2">
        <a
          href="#"
          id="change-language"
          className="text-eo_orange"
          onClick={(e) => changeLanguage(e, globalCtx?.global.lang)}
        >
          {globalCtx?.global.lang}
        </a>
      </li> */}
    </ul>
  );
};

export default Menu;
