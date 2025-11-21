import { useEffect, useState, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../service/api";
import api_fr from "../service/api_fr";
import axios from "axios";

const ProductCategoryLayout = lazy(
  () => import("../layout/ProductCategoryLayout")
);
const ProductList = lazy(() => import("../blocks/ProductList"));
const ErrorPage = lazy(() => import("./ErrorPage"));
const PageTransition = lazy(() => import("../animations/PageTransition"));

const ProductCategory = () => {
  const [title, setTitle] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [canonical, setCanonical] = useState<string>(
    `${import.meta.env.VITE_BASE_URL}${window.location.pathname}`
  );
  const getParams = useParams();
  const category = getParams.category;
  const globalCtx = useContext(GlobalContext);
  const location = useLocation();
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unknown error, please try again later"
  );

  const getMetaDescription = async (tid: number) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_DOMAIN_BACKEND
        }${import.meta.env.VITE_TAXONOMY_TERM.replace("{tid}", tid)}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data[0].field_meta_title.length > 0)
          setMetaTitle(data[0].field_meta_title[0].value);
        else setMetaTitle(title);
        if (data[0].field_meta_description.length > 0)
          setMetaDescription(data[0].field_meta_description[0].value);
      });
  };

  const load = async () => {
    try {
      setErrorMessage("Unknown error");
      setShowError(false);
      const product_categories_url = `${
        import.meta.env.VITE_API_PRODUCTS_CATEGORIES
      }`;
      let response_categories: any = null;
      if (globalCtx?.global.lang === "Fr") {
        response_categories = await api.get(product_categories_url);
      } else {
        response_categories = await api_fr.get(product_categories_url);
      }
      let category_title: string = "";
      for (let item of response_categories!.data.data) {
        if (
          item.attributes.path.alias === location.pathname ||
          item.attributes.path.alias === window.history.state.url
        ) {
          //request the specific category
          let product_category_request: any = null;
          if (globalCtx?.global.lang === "Fr") {
            product_category_request = await api.get(
              `${product_categories_url}/${item.id}`
            );
          } else {
            product_category_request = await api_fr.get(
              `${product_categories_url}/${item.id}`
            );
          }
          category_title = product_category_request.data.data.attributes.name;
          setTitle(category_title);

          //replace url
          let url = `${product_category_request.data.data.attributes.path.alias}`;
          setCanonical(
            `${import.meta.env.VITE_BASE_URL}${
              product_category_request.data.data.attributes.path.alias
            }`
          );

          // set meta description
          getMetaDescription(item.attributes.drupal_internal__tid);

          const nextURL = url;
          const nextTitle = product_category_request.data.data.attributes.name;
          const nextState = {
            url: url,
          };
          window.history.replaceState(nextState, nextTitle, nextURL);
        }
      }
    } catch (error: any) {
      if (typeof error === "object" && error !== null) {
        switch (error.code) {
          case "ERR_NETWORK":
            setShowError(true);
            setErrorMessage(
              "Ups!! there is a problem with the connection, please try again later"
            );
            break;
        }
      }
    }
  };
  useEffect(() => {
    load();
  }, [globalCtx?.global]);
  if (showError)
    return (
      <PageTransition effect="opacity">
        <ErrorPage
          title="500 Error"
          body={errorMessage}
          second_body=""
          third_body=""
          image=""
          alias=""
          metaDescription=""
        />
      </PageTransition>
    );
  return (
    <PageTransition effect="opacity">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {title}
        </title>
        <meta name="description" content={metaDescription} />
        <meta
          name="title"
          content={`${import.meta.env.VITE_PROJECT_NAME} | ${metaTitle}`}
        />
      </Helmet>
      <ProductCategoryLayout
        title={title}
        titleClass="text-center py-4 text-eo_orange uppercase bg-eo_gray_products"
      >
        <ProductList />
      </ProductCategoryLayout>
    </PageTransition>
  );
};

export default ProductCategory;
