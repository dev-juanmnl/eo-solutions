import { GlobalContext } from "../context/Global";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuSecondLevel from "./MenuSecondLevel";
import MenuThirdLevel from "./MenuThirdLevel";
import { MenuProps } from "../types/MenuProps";
const MenuFirstLevel: React.FunctionComponent<MenuProps> = (
  props: MenuProps
) => {
  const [showThirdLevel, setShowThirdLevel] = useState(false);
  const globalCtx = useContext(GlobalContext);
  const [menu, setMenu] = useState<{}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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
      if (sessionStorage.getItem("menu_items") !== null) {
        let response = JSON.parse(sessionStorage.getItem("menu_items")!);
        setMenu(response.data.data);
      }
    } catch (error) {}
  };
  const showSubMenu = (level: number, category_id: string) => {
    setSelectedCategory(category_id);
    switch (level) {
      case 1: {
        setShowThirdLevel(false);
        break;
      }
      case 3: {
        setShowThirdLevel(true);
        break;
      }
      default:
    }
  };
  const subMenu = document.getElementById("submenu-first-level");
  useEffect(() => {
    load();
    if (!showThirdLevel) {
      subMenu?.classList.add("active");
    } else {
      subMenu?.classList.remove("active");
    }
  }, [globalCtx?.global, globalCtx?.menuLoaded, showThirdLevel, props]);
  return (
    <>
      <ul
        id="submenu-first-level"
        className="first-level col-span-1 w-full text-base sm:text-lg font-light duration-300 text-black absolute -left-[100%] mt-10 px-6 active"
      >
        {menu.map((menu_item: any, index) => (
          <li key={`menu-item-${index}`}>
            {menu_item.attributes.title !== "News" && (
              <Link
                to={menu_item.attributes.url}
                className="hover:translate-x-6 duration-300 delay-150 block py-2 hover:text-eo_blue-200"
              >
                {menu_item.attributes.title}
              </Link>
            )}
            {menu_item.attributes.title === "Our Products" ||
            menu_item.attributes.title === "Nos produits" ? (
              <MenuSecondLevel
                showSubMenu={showSubMenu}
                isVisible={true}
                selectedCategory={selectedCategory}
                isActive={props.isActive}
                setActive={props.setActive}
              />
            ) : null}
          </li>
        ))}
      </ul>
      <MenuThirdLevel
        showSubMenu={showSubMenu}
        isVisible={showThirdLevel}
        selectedCategory={selectedCategory}
        isActive={props.isActive}
        setActive={props.setActive}
      />
    </>
  );
};

export default MenuFirstLevel;
