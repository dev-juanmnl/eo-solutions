import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ProductInfoProps } from "../types/ProductInfoProps";
import { motion } from "framer-motion";
import api from "../service/api";
import api_fr from "../service/api_fr";
import ImageProduct from "./ImageProduct";
import brochureLogo from "@/assets/images/brochure_button.svg";
import contactLogo from "@/assets/images/contact_button.svg";
import "react-lazy-load-image-component/src/effects/blur.css";
const ProductInfo: React.FunctionComponent<ProductInfoProps> = (
  props: ProductInfoProps
) => {
  const globalCtx = useContext(GlobalContext);
  const [brandImage, setBrandImage] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const load = () => {
    try {
      let url = import.meta.env.VITE_API_BRANDS;
      url += "?include=field_image";
      let response: any = null;
      setTimeout(async () => {
        if (globalCtx?.global.lang === "Fr") response = await api.get(url);
        else if (globalCtx?.global.lang === "En")
          response = await api_fr.get(url);

        let image_id = "";
        response.data.data.forEach((item: any) => {
          if (item.id === props.brand_id) {
            image_id = item.relationships.field_image.data.id;
          }
        });
        //----- Get the file url for brand ----
        let tmpBrandImageSrc = "";
        response.data.included.forEach((item: any) => {
          if (item.id === image_id)
            tmpBrandImageSrc = `${import.meta.env.VITE_DOMAIN_BACKEND}/${
              item.attributes.uri.url
            }`;
        });
        setBrandImage(tmpBrandImageSrc);

        //----- Get the subtitle and category
        const product_list = JSON.parse(
          sessionStorage.getItem("product_list")!
        );
        if (product_list !== null) {
          product_list.data.included.forEach((item: any) => {
            if (item.type === "taxonomy_term--product_subtitles") {
              if (item.id === props.subtitle_id) {
                setSubtitle(item.attributes.name);
              }
            }
            if (item.type === "taxonomy_term--product_categories") {
              if (item.id === props.category_id) {
                setCategory(item.attributes.name);
              }
            }
          });
        }
      }, 1000);
    } catch (error: any) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
  }, [
    globalCtx?.global,
    props.category_id,
    props.subtitle_id,
    props.brochure_url,
  ]);
  return (
    <div className="pl-2 lg:pl-14">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {props.title}
        </title>
        <meta
          name="title"
          content={`${import.meta.env.VITE_PROJECT_NAME} | ${props.title}`}
        />
        <meta
          name="description"
          content={props.body
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/^(.{150}[^\s]*).*/, "$1")
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace("&nbsp;", "")}
        />
      </Helmet>
      <div className="gallery">
        <ImageProduct isGallery={true} images={props.images} />
      </div>
      {props.video !== null && props.video !== "" ? (
        <div
          id="video"
          className="mb-10 mt-10 w-full relative overflow-hidden pt-[56.25%]"
          dangerouslySetInnerHTML={{ __html: props.video }}
        />
      ) : null}
      {brandImage !== "" && (
        <img src={brandImage} className="w-[160px] h-[80px] mb-4" />
      )}
      <ul>
        <li className="text-[1.0rem]">
          {globalCtx?.global.lang === "Fr" ? "Subtitle" : "Sous-titre"}
          {":"} <strong>{subtitle}</strong>
        </li>
        <li className="text-[1.0rem]">
          {globalCtx?.global.lang === "Fr" ? "Category" : "Catégorie"}
          {":"} <strong>{category}</strong>
        </li>
      </ul>
      <div
        className="page-conntent"
        dangerouslySetInnerHTML={{ __html: props.body }}
      />
      <ul className="flex mt-8 lg:mr-8">
        {props.brochure_url !== "" ? (
          <motion.li
            className="ml-0 mt-3"
            whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
          >
            <a
              href={`${import.meta.env.VITE_DOMAIN_BACKEND}${
                props.brochure_url
              }`}
              className="relative text-sm inline-block"
              target={"_blank"}
            >
              <img src={brochureLogo} alt="brochure-logo" />
              <span className="absolute top-6 right-[40px] text-white font-light">
                {globalCtx?.global.lang === "Fr" ? "Brochure" : "Brochure"}
              </span>
            </a>
          </motion.li>
        ) : null}
        <motion.li
          className="ml-0 mt-3"
          whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
        >
          <Link
            to={`${
              globalCtx?.global.lang === "Fr"
                ? `/en/information-request?product_title=${props.title}`
                : `/fr/demande-information?product_title=${props.title}`
            }`}
            className="relative text-sm inline-block"
          >
            <img src={contactLogo} alt="contact-logo" />
            <span className="absolute top-6 right-[40px] text-white font-light">
              {globalCtx?.global.lang === "Fr"
                ? "Contact Us"
                : "Nous contacter"}
            </span>
          </Link>
        </motion.li>
      </ul>
    </div>
  );
};

export default ProductInfo;
