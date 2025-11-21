import { GlobalContext } from "../context/Global";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { LateralMenuProps } from "../types/LateralMenuProps";
import { ProductCategoryTerm } from "../types/ProductCategoriesType";
const MenuSecondLevel: React.FunctionComponent<LateralMenuProps> = (
  props: LateralMenuProps
) => {
  const subMenu = document.getElementById("submenu-second-level");
  const [menuItems, setMenuItems] = useState<ProductCategoryTerm[]>([]);
  const globalCtx = useContext(GlobalContext);
  const { category } = useParams();
  const load = async () => {
    try {
      if (sessionStorage.getItem("product_categories") !== null) {
        let response_categories: any = JSON.parse(
          sessionStorage.getItem("product_categories")!
        );
        //process product categories list
        let menu_items: ProductCategoryTerm[] = [];
        response_categories.data.data.forEach((item: any) => {
          let product_category_item: ProductCategoryTerm = {
            id: "",
            name: "",
            description: "",
            alias: "",
            children: [],
            weight: 0,
          };
          product_category_item.id = item.id;
          product_category_item.name = item.attributes.name;
          product_category_item.description = item.attributes.description;
          product_category_item.alias = item.attributes.path.alias;
          if (item.relationships.parent.data[0].id === "virtual") {
            menu_items.push(product_category_item);
          }
          setMenuItems(menu_items);
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
    if (props.isVisible) {
      subMenu?.classList.add("active");
    } else {
      subMenu?.classList.remove("active");
    }
  }, [props, globalCtx?.global, globalCtx?.productCategoriesLoaded]);
  return (
    <ul
      id="submenu-second-level"
      className="second-level col-span-1 w-full text-base sm:text-lg pl-10 duration-300 font-light relative"
    >
      {menuItems.map((item, i) => (
        <li key={`menu-item-${i}`}>
          <Link
            to="#"
            className={
              `/${category}` === `${item.alias}`
                ? "hover:translate-x-6 duration-300 delay-150 block py-3 text-eo_blue-200 active"
                : "hover:translate-x-6 duration-300 delay-150 block py-3 text-eo_blue-200"
            }
            onClick={() => props.showSubMenu(3, item.id)}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuSecondLevel;
