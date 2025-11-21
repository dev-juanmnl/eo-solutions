import { useState, useEffect, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { ProductInfoProps } from "../types/ProductInfoProps";
import { useSearchParams } from "react-router-dom";
import api from "../service/api";
import api_fr from "../service/api_fr";
const ProductCategoryLayout = lazy(
  () => import("../layout/ProductCategoryLayout")
);
const ProductInfo = lazy(() => import("../blocks/ProductInfo"));
const PageTransition = lazy(() => import("../animations/PageTransition"));
const ErrorPage = lazy(() => import("./ErrorPage"));

const Product = () => {
  const alias = window.location.pathname;
  const [canonical, setCanonical] = useState<string>(
    `${import.meta.env.VITE_BASE_URL}${window.location.pathname}`
  );
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [metaDescription, setMetaDescription] = useState("");
  const globalCtx = useContext(GlobalContext);
  const [title, setTitle] = useState<string>("");
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unknown error, please try again later"
  );
  const [productInfo, setProductInfo] = useState<ProductInfoProps>({
    id: "",
    title: "",
    alias: "",
    body: "",
    brochure_url: "",
    images: [],
    video: "",
    brand_id: "",
    subtitle_id: "",
    category_id: "",
  });
  const load = async () => {
    /**
     * * Get list of products from session and search the product
     */
    try {
      setErrorMessage("Unknown error");
      setShowError(false);
      let product_url = `${import.meta.env.VITE_API_PRODUCTS}/${id}`;
      let include = "?include=field_brochure";
      let req_product: any = null;

      //request the product
      if (globalCtx?.global.lang === "Fr")
        req_product = await api.get(`${product_url}${include}`);
      else req_product = await api_fr.get(`${product_url}${include}`);

      if (req_product.status === 200) {
        let data = req_product.data.data;
        let included = req_product.data.included;
        let product_info: ProductInfoProps = {
          id: data.id,
          title: data.attributes.title,
          alias: data.attributes.path.alias,
          body: data.attributes.body.value,
          brochure_url: "",
          images: data.relationships.field_image.data,
          video: "",
          brand_id: data.relationships.field_brand.data.id,
          subtitle_id:
            data.relationships.field_subtitle.data !== undefined
              ? data.relationships.field_subtitle.data.id
              : "",
          category_id:
            data.relationships.field_category.data !== undefined
              ? data.relationships.field_category.data.id
              : "",
        };

        if (
          data.attributes.field_video !== null &&
          data.attributes.field_video !== undefined
        )
          product_info.video = data.attributes.field_video.value;

        let brochure_id = "";
        if (
          data.relationships.field_brochure.data !== null &&
          data.relationships.field_brochure.data !== undefined
        )
          brochure_id = data.relationships.field_brochure.data.id;

        setTitle(data.attributes.title);
        //add meta description
        let meta_description = data.attributes.body.value
          .substr(0, 150)
          .replace(/<\/?[^>]+(>|$)/g, "");
        setMetaDescription(`${meta_description} ...`);

        //---- Get the brochure file url ----
        if (included !== undefined) {
          included.forEach((item: any) => {
            if (item.type === "file--file") {
              if (item.id === brochure_id) {
                product_info.brochure_url = item.attributes.uri.url;
              }
            }
          });
        }

        setProductInfo(product_info);

        //replace url
        let url = `${data.attributes.path.alias}?id=${data.id}`;
        setCanonical(`${import.meta.env.VITE_BASE_URL}${url}`);
        const nextURL = url;
        const nextTitle = data.attributes.title;
        const nextState = {
          additionalInformation: "Updated the URL with JS",
          url: url,
        };
        window.history.replaceState(nextState, nextTitle, nextURL);
      }
    } catch (error: any) {
      if (typeof error === "object" && error !== undefined) {
        setShowError(true);
        setErrorMessage(
          "Ups!! there is a problem with the connection, please try again later"
        );
      }
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("product_list") === null)
      globalCtx?.updateProductList(globalCtx?.global.lang);
    setTimeout(() => {
      load();
    }, 1000);
  }, []);
  return (
    <PageTransition effect="opacity">
      <ProductCategoryLayout
        title={title}
        titleClass="text-center py-4 text-eo_orange uppercase bg-eo_gray_products text-2xl"
      >
        {productInfo.id !== "" && (
          <ProductInfo
            id={productInfo.id}
            title={productInfo.title}
            body={productInfo.body}
            alias={productInfo.alias}
            brochure_url={productInfo.brochure_url}
            images={productInfo.images}
            video={productInfo.video}
            brand_id={productInfo.brand_id}
            subtitle_id={productInfo.subtitle_id}
            category_id={productInfo.category_id}
          />
        )}
      </ProductCategoryLayout>
    </PageTransition>
  );
};

export default Product;
