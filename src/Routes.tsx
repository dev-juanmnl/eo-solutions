import { useEffect, useContext, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GlobalContext } from "./context/Global";
import { AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
const Home = lazy(() => import("./pages/Home"));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const Product = lazy(() => import("./pages/Product"));
import Page from "./pages/Page";
const NewsPage = lazy(() => import("./pages/NewsPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ContactProduct = lazy(() => import("./pages/ContactProduct"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OnMaintenancePage = lazy(() => import("./pages/OnMantenance"));
const SearchPage = lazy(() => import("./pages/Search"));

const Main = () => {
  const pathname = window.location.pathname;
  const location = useLocation();
  const globalCtx = useContext(GlobalContext);
  const [langAttribute, setLangAttribute] = useState("en-MU");
  const init = (lang: string) => {
    try {
      globalCtx?.updatePagesListSync(lang === "En" ? "Fr" : "En");
      globalCtx?.updateProductCategoriesSync(lang === "En" ? "Fr" : "En");
      globalCtx?.updateMenuItemsSync(lang === "En" ? "Fr" : "En");
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
  const setLanguage = (value: string) => {
    globalCtx?.setLanguage(value === "Fr" ? "En" : "Fr");
    if (value === "En") setLangAttribute("en-MU");
    else setLangAttribute("fr-MU");
  };
  const updateAttributeLang = () => {
    if (globalCtx?.global.lang === "Fr") setLangAttribute("en-MU");
    else setLangAttribute("fr-MU");
  };
  useEffect(() => {
    //set english as default language and save it in the session storage
    let lang = "En";
    // if (pathname !== null && pathname !== undefined && pathname !== "/") {
    //   let path_splitted = pathname.split("/");
    //   lang = path_splitted[1];
    // }
    let first_letter = lang.charAt(0);
    let first_letter_cap = first_letter.toUpperCase();
    let remmaining_letters = lang.substring(1);
    let new_language = `${first_letter_cap}${remmaining_letters}`;
    sessionStorage.setItem("lang", new_language);
    setLanguage(new_language);
    init(new_language);
  }, []);
  useEffect(() => {
    updateAttributeLang();
  }, [globalCtx?.global]);
  //mantenance page | Under construction
  if (false)
    return (
      <>
        <Helmet
          htmlAttributes={{
            lang: langAttribute,
          }}
        ></Helmet>
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<OnMaintenancePage />} />
        </Routes>
      </>
    );
  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: langAttribute,
        }}
      ></Helmet>
      <AnimatePresence exitBeforeEnter>
        {/* <div className="absolute inset-0 100vh" id="language-screen">
          <div className="relative z-50 grid grid-cols-1 items-center h-[0vh] bg-eo_gray_footer overflow-hidden">
            <p>
              {globalCtx?.global.lang === "Fr"
                ? "English message"
                : "Message en français"}
            </p>
          </div>
        </div> */}
        <Suspense fallback={<>loading...</>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/:lang" element={<Home />} />
            <Route path="/:lang/page/:alias" element={<Page />} />
            <Route path="/:lang/page/news/:alias" element={<NewsPage />} />
            {/* <Route path="/:lang/page/nouvelles/:alias" element={<NewsPage />} /> */}
            <Route
              path="/:lang/page/our-solutions/:category"
              element={<ProductCategory />}
            />
            {/* <Route
              path="/:lang/page/nos-produits/:category"
              element={<ProductCategory />}
            /> */}
            <Route
              path="/:lang/page/our-solutions/:category/:sub_category"
              element={<ProductCategory />}
            />
            {/* <Route
              path="/:lang/page/nos-produits/:category/:sub_category"
              element={<ProductCategory />}
            /> */}
            <Route
              path="/:lang/page/our-solutions/:category/:sub_category/:product_title"
              element={<Product />}
            />
            {/* <Route
              path="/:lang/page/nos-produits/:category/:sub_category/:product_title"
              element={<Product />}
            /> */}
            <Route path="/:lang/contact-us" element={<ContactUs />} />
            {/* <Route path="/:lang/nous-contacter" element={<ContactUs />} /> */}
            <Route
              path="/:lang/information-request"
              element={<ContactProduct />}
            />
            {/* <Route
              path="/:lang/demande-information"
              element={<ContactProduct />}
            /> */}
            <Route path="/:lang/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

export default Main;
