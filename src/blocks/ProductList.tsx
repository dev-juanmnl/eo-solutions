import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ProductType } from "../types/PrductType";
import { filterItemI } from "../types/ProductListProps";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import ProductFilter from "../blocks/ProductFilter";
import Pagination from "../blocks/Pagination";
import api from "../service/api";
import api_fr from "../service/api_fr";
import ImageProduct from "./ImageProduct";
import Spinner from "./Spinner";
import rest from "../service/rest";

const ProductList = () => {
  const globalCtx = useContext(GlobalContext);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const brand = urlSearchParams.get("brand");
  const brandName = urlSearchParams.get("brand_name");
  const location = useLocation();
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [sidebarCategory, setSidebarCategory] = useState(null);
  const [brands, setBrands] = useState<filterItemI[]>([]);
  const [subtitles, setSubtitles] = useState<filterItemI[]>([]);
  const [categories, setCategories] = useState<filterItemI[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<filterItemI[]>(
    brand ? [{ id: brand, name: brandName! }] : []
  );
  const [selectedSubtitles, setSelectedSubtitles] = useState<filterItemI[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<filterItemI[]>(
    []
  );
  const [msgProductList, setMsgProductList] = useState<string>("");
  const [prevPage, setPrevPage] = useState<string>("");
  const [nextPage, setNextPage] = useState<string>("");
  const [lastPage, setLastPage] = useState<string>("");
  const [firstPage, setFirstPage] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const blockVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 1.2,
      },
    },
  };
  const load = async () => {
    try {
      setError(false);
      setErrorMessage("");

      let response_categories = JSON.parse(
        sessionStorage.getItem("product_categories")!
      );
      let categories_url = import.meta.env.VITE_API_PRODUCTS_CATEGORIES;
      let category_id: any = "all";

      /* GET THE CURRENT PAGE CATEGORY */
      for (let item of response_categories.data.data) {
        if (item.attributes.path.alias === location.pathname) {
          let category_response: any = null;
          if (globalCtx?.global.lang === "Fr")
            category_response = await api.get(`${categories_url}/${item.id}`);
          else
            category_response = await api_fr.get(
              `${categories_url}/${item.id}`
            );
          category_id = parseInt(
            category_response.data.data.attributes.drupal_internal__tid
          );
        }
      }
      setSidebarCategory(category_id);

      /* GET ALL THE CATEGORIES */
      let tmpProductCategories: filterItemI[] = [];
      let product_categories_url = `${
        import.meta.env.VITE_API_VIEW_PRODUCTS_CATEGORIES
      }/${category_id}`;
      let response_product_categories = await rest.get(product_categories_url);
      response_product_categories!.data.forEach((item: any) => {
        if (item.langcode[0].value !== globalCtx?.global.lang.toLowerCase())
          tmpProductCategories = tmpProductCategories.find(
            (i) => i.id === parseInt(item.tid[0].value)
          )
            ? tmpProductCategories
            : [
                ...tmpProductCategories,
                {
                  name: item.name[0].value,
                  id: parseInt(item.tid[0].value),
                },
              ];
      });
      setCategories(tmpProductCategories);

      /* GET ALL BRANDS */
      let tmpProductBrands: filterItemI[] = [];
      let url_brands = `${import.meta.env.VITE_API_VIEW_BRANDS}/${category_id}`;
      let brands_response = await rest.get(`${url_brands}`);

      brands_response!.data.forEach((item: any) => {
        if (item.langcode[0].value !== globalCtx?.global.lang.toLowerCase())
          tmpProductBrands = tmpProductBrands.find(
            (i) => i.id === parseInt(item.tid[0].value)
          )
            ? tmpProductBrands
            : [
                ...tmpProductBrands,
                {
                  name: item.name[0].value,
                  id: parseInt(item.tid[0].value),
                },
              ];
      });
      setBrands(tmpProductBrands);

      /* GET ALL SUBTITLES */
      let tmpProductSubtitles: filterItemI[] = [];
      let url_subtitles = `${
        import.meta.env.VITE_API_VIEW_PRODUCTS_SUBTITLES
      }/${category_id}`;
      let subtitles_response = await rest.get(`${url_subtitles}`);
      subtitles_response!.data.forEach((item: any) => {
        if (item.langcode[0].value !== globalCtx?.global.lang.toLowerCase())
          tmpProductSubtitles = tmpProductSubtitles.find(
            (i) => i.id === parseInt(item.tid[0].value)
          )
            ? tmpProductSubtitles
            : [
                ...tmpProductSubtitles,
                {
                  name: item.name[0].value,
                  id: parseInt(item.tid[0].value),
                },
              ];
      });
      setSubtitles(tmpProductSubtitles);

      filter("", category_id);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        setError(true);
        setErrorMessage(
          "There was an error, please contact with the administrator"
        );
      }
    }
  };
  const updateFilter = (value: any, type: string) => {
    let item: filterItemI = { name: "", id: "" };

    if (type === "brand") {
      item = brands.find((i) => i.id === parseInt(value))!;
      if (!selectedBrands.find((i) => i.id === parseInt(value))) {
        setSelectedBrands([...selectedBrands, item]);
        filter(
          "",
          sidebarCategory!,
          selectedSubtitles,
          [...selectedBrands, item],
          selectedCategories
        );
      }
    }
    if (type === "subtitle") {
      item = subtitles.find((i) => i.id === parseInt(value))!;
      if (!selectedSubtitles.find((i) => i.id === parseInt(value))) {
        setSelectedSubtitles([...selectedSubtitles, item]);
        filter(
          "",
          sidebarCategory!,
          [...selectedSubtitles, item],
          selectedBrands,
          selectedCategories
        );
      }
    }
    if (type === "category") {
      item = categories.find((i) => i.id === parseInt(value))!;
      if (!selectedCategories.find((i) => i.id === parseInt(value))) {
        setSelectedCategories([...selectedCategories, item]);
        filter("", sidebarCategory!, selectedSubtitles, selectedBrands, [
          ...selectedCategories,
          item,
        ]);
      }
    }
  };
  const resetFilter = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSubtitles([]);
    filter("", sidebarCategory!, [], [], []);
  };
  const changeCurrentPage = (url: string) => {
    filter(url, sidebarCategory!);
  };
  const filter = async (
    current_page?: string,
    category_id?: any,
    filterSelectedSubtitles: filterItemI[] = selectedSubtitles,
    filterSelectedBrands: filterItemI[] = selectedBrands,
    filterSelectedCategories: filterItemI[] = selectedCategories
  ) => {
    let response_products_list: any = null;
    let product_list: ProductType[] = [];
    setShowLoading(true);

    let url: string = "";
    if (current_page === "") {
      //get and filter the products list
      url = `${import.meta.env.VITE_API_PRODUCTS}`;

      let include =
        "include=field_image,field_brand,field_subtitle,field_brochure,field_category";
      let filter = "";
      let andGroup = "&filter[and-group][group][conjunction]=AND";
      let orGroup =
        "&filter[or-group][group][conjunction]=OR&filter[or-group][group][memberOf]=and-group";
      if (category_id !== "all")
        filter = `&filter[category][condition][path]=field_product_category.meta.drupal_internal__target_id&filter[category][condition][value]=${category_id}&filter[category][condition][memberOf]=and-group`;
      let pager = `&page[limit]=12`;

      let field_filter = "";

      /* CREATE THE BRAND FILTER */
      if (filterSelectedBrands.length > 0) {
        field_filter += `&filter[brand][condition][path]=field_brand.meta.drupal_internal__tid&filter[brand][condition][memberOf]=or-group&filter[brand][condition][operator]=IN`;
        let counter = 0;
        filterSelectedBrands.forEach((item: filterItemI) => {
          field_filter += `&filter[brand][condition][value][${++counter}]=${
            item.id
          }`;
        });
      }
      /* CREATE THE CATEGORY FILTER */
      if (filterSelectedCategories.length > 0) {
        field_filter += `&filter[product-category][condition][path]=field_category.meta.drupal_internal__tid&filter[product-category][condition][memberOf]=or-group&filter[product-category][condition][operator]=IN`;
        let counter = 0;
        filterSelectedCategories.forEach((item: filterItemI) => {
          field_filter += `&filter[product-category][condition][value][${++counter}]=${
            item.id
          }`;
        });
      }
      /* CREATE THE SUBTITLE FILTER */
      if (filterSelectedSubtitles.length > 0) {
        field_filter += `&filter[subtitle][condition][path]=field_subtitle.meta.drupal_internal__tid&filter[subtitle][condition][memberOf]=or-group&filter[subtitle][condition][operator]=IN`;
        let counter = 0;
        filterSelectedSubtitles.forEach((item: filterItemI) => {
          field_filter += `&filter[subtitle][condition][value][${++counter}]=${
            item.id
          }`;
        });
      }

      //create group filter if there is one of the elements selected
      if (
        filterSelectedBrands.length > 0 ||
        filterSelectedCategories.length > 0 ||
        filterSelectedSubtitles.length > 0
      ) {
        filter += field_filter;
        url += `?${include}${andGroup}${orGroup}${filter}${pager}`;
      } else if (brand !== null && category_id === "all") {
        setSelectedBrands(brands.filter((i) => i.id === parseInt(brand)));
        field_filter += `&filter[brand][condition][path]=field_brand.meta.drupal_internal__tid&filter[brand][condition][memberOf]=or-group&filter[brand][condition][operator]=IN&filter[brand][condition][value][0]=${brand}`;
        filter += field_filter;
        url += `?${include}${andGroup}${orGroup}${filter}${pager}`;
      } else {
        url += `?${include}${andGroup}${filter}${pager}`;
      }
    } else {
      url = current_page!;
    }

    try {
      if (globalCtx?.global.lang === "Fr")
        response_products_list = await api.get(url!);
      else response_products_list = await api_fr.get(url!);

      //save the filtered product list in sessionStorage
      sessionStorage.setItem(
        "product_list",
        JSON.stringify(response_products_list)
      );

      if (response_products_list.data.data.length > 0) {
        //----- Process the list -----
        response_products_list.data.data.forEach((item: any) => {
          let product: ProductType = {
            id: item.id,
            title: item.attributes.title,
            alias: item.attributes.path.alias,
            images: item.relationships.field_image.data,
          };
          product_list.push(product);
        });
        //------ Set pagination -----
        if (response_products_list.data.links !== undefined) {
          if (response_products_list.data.links.prev !== undefined)
            setPrevPage(response_products_list.data.links.prev.href);
          if (response_products_list.data.links.next !== undefined)
            setNextPage(response_products_list.data.links.next.href);
          if (response_products_list.data.links.last !== undefined)
            setLastPage(response_products_list.data.links.last.href);
          if (response_products_list.data.links.first !== undefined)
            setFirstPage(response_products_list.data.links.first.href);
        }
        setMsgProductList("");
      } else {
        if (globalCtx?.global.lang === "Fr")
          setMsgProductList(import.meta.env.VITE_TRANSLATIONS_PRODUCT_LIST);
        else
          setMsgProductList(import.meta.env.VITE_TRANSLATIONS_PRODUCT_LIST_FR);
      }
      setProductsList(product_list);
      setShowLoading(false);

      let form: HTMLFormElement = document.getElementById(
        "filter"
      )! as HTMLFormElement;
      if (form) {
        form.reset();
      }
    } catch (error: any) {
      if (typeof error === "object" && error !== undefined) {
        setShowLoading(false);
        setError(true);
        setErrorMessage(
          "There was an error, please contact with the administrator"
        );
      }
    }
  };
  const removeElementFilter = (value: any, type: string) => {
    let tmpSelectedSubtitles = selectedSubtitles;
    let tmpSelectedBrands = selectedBrands;
    let tmpSelectedCategories = selectedCategories;
    if (type === "brand") {
      tmpSelectedBrands = selectedBrands.filter((item) => item.id !== value);
      setSelectedBrands(tmpSelectedBrands);
      filter(
        "",
        sidebarCategory!,
        selectedSubtitles,
        tmpSelectedBrands,
        selectedCategories
      );
    }
    if (type === "subtitle") {
      tmpSelectedSubtitles = selectedSubtitles.filter(
        (item) => item.id !== value
      );
      setSelectedSubtitles(tmpSelectedSubtitles);
      filter(
        "",
        sidebarCategory!,
        tmpSelectedBrands,
        selectedBrands,
        selectedCategories
      );
    }
    if (type === "category") {
      tmpSelectedCategories = selectedCategories.filter(
        (item) => item.id !== value
      );
      setSelectedCategories(tmpSelectedCategories);
      filter(
        "",
        sidebarCategory!,
        selectedSubtitles,
        selectedBrands,
        tmpSelectedCategories
      );
    }
  };
  useEffect(() => {
    setTimeout(() => {
      load();
    }, 1000);
  }, [globalCtx?.global]);
  return (
    <>
      <ProductFilter
        subtitles={subtitles}
        brands={brands}
        categories={categories}
        updateFilter={updateFilter}
        resetFilter={resetFilter}
      />
      {(selectedBrands.length !== 0 ||
        selectedCategories.length !== 0 ||
        selectedSubtitles.length !== 0) && (
        <>
          <h3 className="mb-2">Selected Filters</h3>
          <div
            id="filter-selection"
            className="flex flex-wrap py-4 px-4 mb-4 bg-eo_gray_products"
          >
            {selectedBrands.length !== 0 &&
              selectedBrands.map((item, index) => (
                <div
                  className="filter-selection-item flex justify-between bg-eo_gray_footer px-4 py-2 text-white rounded-2xl text-sm mr-2 mb-2"
                  key={`selected-brand-${index}`}
                >
                  {item.name}
                  <span
                    id={`selected-brand-${item.id}`}
                    className="ml-4 cursor-pointer"
                    onClick={() => removeElementFilter(item.id, "brand")}
                  >
                    X
                  </span>
                </div>
              ))}
            {selectedSubtitles.length !== 0 &&
              selectedSubtitles.map((item, index) => (
                <div
                  className="filter-selection-item flex justify-between bg-eo_gray_footer px-4 py-2 text-white rounded-2xl text-sm mr-2 mb-2"
                  key={`selected-subtitle-${index}`}
                >
                  {item.name}
                  <span
                    id={`selected-subtitle-${item.id}`}
                    className="ml-4 cursor-pointer"
                    onClick={() => removeElementFilter(item.id, "subtitle")}
                  >
                    X
                  </span>
                </div>
              ))}
            {selectedCategories.length !== 0 &&
              selectedCategories.map((item, index) => (
                <div
                  className="filter-selection-item flex justify-between bg-eo_gray_footer px-4 py-2 text-white rounded-2xl text-sm mr-2 mb-2"
                  key={`selected-category-${index}`}
                >
                  {item.name}
                  <span
                    id={`selected-category-${item.id}`}
                    className="ml-4 cursor-pointer"
                    onClick={() => removeElementFilter(item.id, "category")}
                  >
                    X
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
      {showLoading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500 w-[90%] lg:w-[400px] m-auto mt-10 p-2 rounded-lg border border-red-600 bg-red-200">
          {errorMessage}
        </p>
      ) : (
        <div className="product-list flex flex-wrap">
          {productsList.map((item, index) => (
            <motion.div
              className="product-teaser w-[90%] sm:w-[43.5%] md:w-[43.5%] lg:w-[43.5%] xl:w-[28%] mx-4 mb-10 overflow-hidden"
              key={`product-teaser-${index}`}
              initial="offscreen"
              whileInView="onscreen"
            >
              <motion.div variants={blockVariants}>
                <Link to={`${item.alias}?id=${item.id}`}>
                  <ImageProduct
                    isGallery={false}
                    images={item.images !== null ? item.images : []}
                  />
                </Link>
                <h3 className="pl-6 pt-3 pr-3 pb-3 text-eo_blue-200 text-sm font-bold">
                  <Link to={`${item.alias}?id=${item.id}`}>{item.title}</Link>
                </h3>
              </motion.div>
            </motion.div>
          ))}
          <p className="text-center w-full">{msgProductList}</p>
        </div>
      )}

      <Pagination
        prev={prevPage}
        next={nextPage}
        first={firstPage}
        last={lastPage}
        changeCurrentPage={changeCurrentPage}
      />
    </>
  );
};

export default ProductList;
