import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/Global";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProductCategoryTerm } from "../types/ProductCategoriesType";
import getProductList from "../components/ProductOrderedList";
import api from "../service/api";
import api_fr from "../service/api_fr";
const ProductCategories = () => {
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryTerm[]
  >([]);
  const load = async () => {
    try {
      const product_categories_url = `${
        import.meta.env.VITE_API_PRODUCTS_CATEGORIES
      }`;
      let res: any = null;
      if (globalCtx?.global.lang === "Fr") {
        res = await api.get(product_categories_url);
      } else {
        res = await api_fr.get(product_categories_url);
      }
      let product_categories = getProductList(res);

      //order the list based on the weight
      let ordered_product_categories: any[] = product_categories.sort(
        (a: any, b: any) => {
          if (a.weight < b.weight) return -1;
          if (a.weight > b.weight) return 1;
          return 0;
        }
      );
      setProductCategories(ordered_product_categories);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
  }, [globalCtx?.global, globalCtx?.categories]);
  return (
    <div id="product-categories-sidebar">
      {productCategories.map((item, index) => (
        <div
          className={
            location.pathname.search(`${item.alias}`) !== -1
              ? "collapse-open collapse-plus border-b-2 border-b-base-300"
              : "collapse collapse-plus border-b-2 border-b-base-300"
          }
          key={`product-category-${index}`}
        >
          {location.pathname.search(`${item.alias}`) === -1 ? (
            <input type="checkbox" className="peer" />
          ) : null}
          <div className="collapse-title text-base text-black font-medium">
            {item.name}
          </div>
          <div className="collapse-content">
            <ul className="w-full pl-2 text-[14px]">
              {item.children.map((sub_item, index2) => (
                <li key={`sub-category-${index2}`}>
                  <Link
                    className={
                      location.pathname === `${sub_item.alias}`
                        ? "block text-eo_blue-200 font-bold active"
                        : "block text-eo_blue-200 font-bold"
                    }
                    to={`${sub_item.alias}`}
                  >
                    {sub_item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCategories;
