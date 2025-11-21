import { GlobalContext } from "../context/Global";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { LateralMenuProps } from "../types/LateralMenuProps";
import { ProductCategoryTerm } from "../types/ProductCategoriesType";
const MenuThirdLevel: React.FunctionComponent<LateralMenuProps> = (
  props: LateralMenuProps
) => {
  const subMenu = document.getElementById("submenu-third-level");
  const [menuItems, setMenuItems] = useState<ProductCategoryTerm[]>([]);
  const globalCtx = useContext(GlobalContext);
  const { category, sub_category } = useParams();
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
          if (item.relationships.parent.data[0].id !== "virtual") {
            if (
              props.selectedCategory === item.relationships.parent.data[0].id
            ) {
              product_category_item.id = item.id;
              product_category_item.name = item.attributes.name;
              product_category_item.description = item.attributes.description;
              product_category_item.alias = item.attributes.path.alias;
              menu_items.push(product_category_item);
            }
          }
        });
        setMenuItems(menu_items);
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
      id="submenu-third-level"
      className="third-level col-span-1 w-full text-lg px-10 duration-300 font-light absolute -left-[100%] mt-[50%]"
    >
      <li className="py-3">
        <button
          className="back w-full font-bold mb-10 text-eo_orange text-center"
          onClick={() => props.showSubMenu(1, "")}
        >
          <span className="pt-2">&#8592;</span>
          Back
        </button>
      </li>
      {menuItems.map((item, i) => (
        <li key={`sub-menu-item-${i}`}>
          <Link
            to={`${item.alias}`}
            className={
              `/${category}/${sub_category}` === `${item.alias}`
                ? "hover:translate-x-6 duration-300 delay-150 block py-3 text-eo_blue-200 active"
                : "hover:translate-x-6 duration-300 delay-150 block py-3 text-eo_blue-200"
            }
            onClick={() => props.setActive(!props.isActive)}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuThirdLevel;
