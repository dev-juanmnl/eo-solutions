import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import { ProductCategoryTerm } from "../types/ProductCategoriesType";
import getProductsList from "../components/ProductOrderedList";

const OurProductsAccordion = () => {
  const globalCtx = useContext(GlobalContext);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryTerm[]
  >([]);
  const load = async () => {
    try {
      if (sessionStorage.getItem("product_categories") !== null) {
        let response: any = JSON.parse(
          sessionStorage.getItem("product_categories")!
        );
        let product_categories = getProductsList(response);

        //order the list based on the weight
        let ordered_product_categories: any[] = product_categories.sort(
          (a: any, b: any) => {
            if (a.weight < b.weight) return -1;
            if (a.weight > b.weight) return 1;
            return 0;
          }
        );
        setProductCategories(ordered_product_categories);
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    setTimeout(() => {
      load();
    }, 2000);
  }, [globalCtx?.global, globalCtx?.productCategoriesLoaded]);
  return (
    <div
      id="our-products-accordion"
      className="pl-6 pt-4 sm:pl-14 sm:pt-8 xl:pl-28 xl:pt-20 pr-6 pb-6 bg-eo_gray_products text-black"
    >
      {productCategories.map((item, index) => (
        <div
          className="collapse collapse-plus border-b-2 border-white"
          key={`product-category-${index}`}
        >
          <label
            className="hidden"
            htmlFor={`accordeon-element-${index}`}
          ></label>
          <input
            type="checkbox"
            className="peer"
            id={`accordeon-element-${index}`}
          />
          <div className="collapse-title text-xl font-medium">{item.name}</div>
          <div className="collapse-content">
            {item.description !== "" ? (
              <div
                className="font-bold"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            ) : null}
            <ul className="mt-8 text-eo_blue-200 font-bold">
              {item.children.map((sub_item, index2) => (
                <li className="py-1" key={`sub-category-${index2}`}>
                  <Link to={`${sub_item.alias}`}>{sub_item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurProductsAccordion;
