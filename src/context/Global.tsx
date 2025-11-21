import React, { createContext } from "react";
import api from "../service/api";
import api_fr from "../service/api_fr";
import { GlobalContextType, IGlobal } from "../types/GlobalContextType";

export const GlobalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [global, setGlobal] = React.useState<IGlobal>({
    lang: "Fr",
  });
  const [categories, setCategories] = React.useState(
    sessionStorage.getItem("product_categories") !== null
      ? JSON.parse(sessionStorage.getItem("product_categories")!)
      : null
  );
  const [menuLoaded, setMenuLoaded] = React.useState<boolean>(false);
  const [productCategoriesLoaded, setProductCategoriesLoaded] =
    React.useState<boolean>(false);
  const [pagesListLoaded, setPagesListLoaded] = React.useState<boolean>(false);
  const updatePagestList = async (value: string) => {
    //update pages list
    try {
      const all_products_url = import.meta.env.VITE_API_ALL_PAGES; //url to obtain all the pages information
      let response_pages: any = null;
      if (value === "Fr") response_pages = await api.get(all_products_url);
      else response_pages = await api_fr.get(all_products_url);
      sessionStorage.setItem("pages", JSON.stringify(response_pages.data.data));
    } catch (error: any) {
      if (typeof error === "object" && error !== null) {
        switch (error.code) {
          case "ERR_NETWORK":
            console.error("Server is not online");
            break;
          default:
            console.error("Unknown error", error);
            break;
        }
      }
    }
  };
  const updateProductList = async (value: string) => {
    try {
      let response_products_list = null;
      let url: string = "";
      //get and filter the products list
      url = `${import.meta.env.VITE_API_PRODUCTS}`;
      let include =
        "include=field_image,field_brand,field_subtitle,field_brochure,field_category";
      url += `?${include}`;

      if (value === "Fr") response_products_list = await api.get(url!);
      else response_products_list = await api_fr.get(url!);

      //save the filtered product list in sessionStorage
      sessionStorage.setItem(
        "product_list",
        JSON.stringify(response_products_list)
      );
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const updateProductCategories = async (value: string) => {
    try {
      let response_categories: any | null = null;
      let product_categories_url = import.meta.env.VITE_API_PRODUCTS_CATEGORIES;
      if (value === "Fr") {
        response_categories = await api.get(product_categories_url);
      } else {
        response_categories = await api_fr.get(product_categories_url);
      }
      setCategories(JSON.stringify(response_categories));
      sessionStorage.setItem(
        "product_categories",
        JSON.stringify(response_categories)
      );
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const updateNewsList = async (value: string) => {
    try {
      let url_article = import.meta.env.VITE_API_ALL_ARTICLES;
      let url_categories = import.meta.env.VITE_API_NEWS_CATEGORIES;
      let response_articles: any = null,
        response_categories: any = null;
      //-------- get the articles and categories ------
      if (value === "Fr") {
        response_categories = await api.get(url_categories);
        response_articles = await api.get(url_article);
      } else {
        response_categories = await api_fr.get(url_categories);
        response_articles = await api_fr.get(url_article);
      }
      sessionStorage.setItem("news_list", JSON.stringify(response_articles));
      sessionStorage.setItem(
        "news_categories",
        JSON.stringify(response_categories.data.data)
      );
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const updateMenuItems = async (value: string) => {
    try {
      let url = import.meta.env.VITE_API_MAIN_MENU;
      if (value === "En") url = import.meta.env.VITE_API_MAIN_MENU_FR;
      let response_menu = await api.get(url);
      sessionStorage.setItem("menu_items", JSON.stringify(response_menu));
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const setLanguage = (value: string) => {
    setGlobal({ lang: value });
  };
  const changeLanguage = (value: string) => {
    updatePagestList(value);
    updateNewsList(value);
    updateProductList(value);
    updateProductCategories(value);
    updateMenuItems(value);
    setGlobal({ lang: value });
  };
  const updateMenuItemsSync = (value: string) => {
    try {
      let url = import.meta.env.VITE_API_MAIN_MENU;
      if (value === "En") url = import.meta.env.VITE_API_MAIN_MENU_FR;
      api.get(url).then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("menu_items", JSON.stringify(res));
          setMenuLoaded(true);
        }
      });
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const updateProductCategoriesSync = (value: string) => {
    try {
      let product_categories_url = `${
        import.meta.env.VITE_API_PRODUCTS_CATEGORIES
      }`;
      if (value === "Fr") {
        api.get(product_categories_url).then((res) => {
          sessionStorage.setItem("product_categories", JSON.stringify(res));
          setCategories(res);
        });
      } else {
        api_fr.get(product_categories_url).then((res) => {
          sessionStorage.setItem("product_categories", JSON.stringify(res));
          setCategories(res);
        });
      }
    } catch (error: any) {
      switch (error.code) {
        case "ERR_NETWORK":
          console.error("Server is not online");
          break;
        default:
          console.error("Unknown error", error);
          break;
      }
    }
  };
  const updatePagesListSync = (value: string) => {
    try {
      const all_products_url = import.meta.env.VITE_API_ALL_PAGES;
      if (value === "Fr")
        api.get(all_products_url).then((res) => {
          sessionStorage.setItem("pages", JSON.stringify(res.data.data));
        });
      else
        api_fr.get(all_products_url).then((res) => {
          sessionStorage.setItem("pages", JSON.stringify(res.data.data));
        });
    } catch (error: any) {
      if (typeof error === "object" && error !== null) {
        switch (error.code) {
          case "ERR_NETWORK":
            console.error("Server is not online");
            break;
          default:
            console.error("Unknown error", error);
            break;
        }
      }
    }
  };
  return (
    <GlobalContext.Provider
      value={{
        global,
        menuLoaded,
        pagesListLoaded,
        categories,
        productCategoriesLoaded,
        changeLanguage,
        setLanguage,
        updatePagestList,
        updateNewsList,
        updateProductList,
        updateProductCategories,
        updateMenuItems,
        updateMenuItemsSync,
        updateProductCategoriesSync,
        updatePagesListSync,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
