import { useState, useEffect, useContext, lazy } from "react";
import { Link } from "react-router-dom";
import { NewsPageType } from "../types/NewsPageType";
import { motion, Variants } from "framer-motion";
import { Helmet } from "react-helmet";
import { isMobileOnly, isTablet, isDesktop } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GlobalContext } from "../context/Global";
import moment from "moment";
import api from "../service/api";
import api_fr from "../service/api_fr";
const Main = lazy(() => import("../layout/MainLayout"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const ContactUs = lazy(() => import("../blocks/ContactUs"));
const RelatedNews = lazy(() => import("../blocks/RelatedNews"));
const PageTransition = lazy(() => import("../animations/PageTransition"));
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
const BlockBlueTransition = lazy(
  () => import("../animations/BlockBlueTransition")
);
const ErrorPage = lazy(() => import("./ErrorPage"));
import { truncateText, cleanHtmlTagsFromText } from "../helpers/Functions";
import fb_share_icon from "../assets/images/fb-orange-round.svg";
import li_share_icon from "../assets/images/linkedin-orange-round.svg";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
import "react-lazy-load-image-component/src/effects/blur.css";

const NewsPage = () => {
  const [newsPageInfo, setNewsPageInfo] = useState<NewsPageType>();
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [idNewsCategory, setIdNewsCategory] = useState("");
  const alias = window.location.pathname;
  const [canonical, setCanonical] = useState<string>(
    `${import.meta.env.VITE_BASE_URL}${window.location.pathname}`
  );
  const globalCtx = useContext(GlobalContext);
  const [blockBlueLeft, setBlockBlueLeft] = useState("");
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unknown error, please try again later"
  );
  const titleVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 15,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 1.2,
      },
    },
  };
  const load = async () => {
    try {
      setErrorMessage("Unknown error");
      setShowError(false);
      let news_url = import.meta.env.VITE_API_ALL_ARTICLES;
      let block_url = import.meta.env.VITE_API_BLOCKS;
      let block_blue_left = import.meta.env.VITE_API_BLOCK_PAGE_NEWS_BLUE_LEFT;
      let response_articles: any = JSON.parse(
          sessionStorage.getItem("news_list")!
        ),
        response_categories: any = JSON.parse(
          sessionStorage.getItem("news_categories")!
        );
      let news_request: any = null;
      let include = "include=field_image";

      //-------- get the articles and categories ------
      if (globalCtx?.global.lang === "EN") {
        block_blue_left = import.meta.env.VITE_API_BLOCK_PAGE_NEWS_BLUE_LEFT_FR;
      }
      let article_image_id = "";
      for (let news_item of response_articles.data.data!) {
        if (
          news_item.attributes.path.alias !== null &&
          news_item.attributes.path.alias === alias
        ) {
          let data: NewsPageType = {
            title: "",
            creationDate: "",
            body: "",
            category: 0,
            metaDescription: "",
          };

          if (globalCtx?.global.lang === "Fr")
            news_request = await api.get(
              `${news_url}/${news_item?.id}?${include}`
            );
          else
            news_request = await api_fr.get(
              `${news_url}/${news_item?.id}?${include}`
            );

          if (
            news_request.data.data.relationships.field_image.data !== undefined
          )
            article_image_id =
              news_request.data.data.relationships.field_image.data.id;
          data.title = news_request.data.data.attributes.title;
          data.creationDate = news_request.data.data.attributes.created;
          data.body = news_request.data.data.attributes.body.value;
          (data.metaDescription =
            news_request.data.data.attributes.body !== null
              ? news_request.data.data.attributes.body.summary
                ? truncateText(
                    cleanHtmlTagsFromText(
                      news_request.data.data.attributes.body.value
                    ),
                    255
                  )
                : news_request.data.data.attributes.body.summary
              : ""),
            (data.category =
              news_request.data.data.relationships.field_news_categories.data.meta.drupal_internal__target_id);
          setNewsPageInfo(data);
          response_categories.forEach((category_item: any) => {
            if (
              category_item.attributes.drupal_internal__tid ===
              news_request.data.data.relationships.field_news_categories.data
                .meta.drupal_internal__target_id
            ) {
              setCategory(category_item.attributes.name);
              setIdNewsCategory(category_item.attributes.drupal_internal__tid);
            }
          });
          //-------- Get the image --------
          news_request.data.included.forEach((item: any) => {
            if (item.id === article_image_id) {
              if (isMobileOnly) setImage(item.attributes.image_style_uri.large);
              if (isTablet) setImage(item.attributes.image_style_uri.wide);
              if (isDesktop)
                setImage(
                  `${import.meta.env.VITE_DOMAIN_BACKEND}${
                    item.attributes.uri.url
                  }`
                );
            }
          });
          //replace url
          let url = `${news_request.data.data.attributes.path.alias}`;
          setCanonical(`${import.meta.env.VITE_BASE_URL}${url}`);
          const nextURL = url;
          const nextTitle = data.title;
          const nextState = {
            additionalInformation: "Updated the URL with JS",
            url: url,
          };
          window.history.replaceState(nextState, nextTitle, nextURL);
        }
      }
      //--------- Block blue left ---------
      getBlockInformation(
        block_url,
        block_blue_left,
        "blue_left",
        globalCtx?.global.lang
      );
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
  const getBlockInformation = async (
    block_url: string,
    block_id: string,
    block_name: string,
    lang: string | undefined
  ) => {
    let response: any = null;
    let content: any = null;
    if (lang === "Fr") response = await api.get(`${block_url}/${block_id}`);
    else response = await api_fr.get(`${block_url}/${block_id}`);
    content = response.data.data.attributes.dependencies.content[0];
    content = content.replaceAll(":", "/");
    if (lang === "Fr") response = await api.get(`/${content}`);
    else response = await api_fr.get(`/${content}`);

    if (block_name === "blue_left")
      setBlockBlueLeft(response.data.data.attributes.body.value);
  };
  useEffect(() => {
    if (sessionStorage.getItem("news_list") === null)
      globalCtx?.updateNewsList(globalCtx.global.lang);
    setTimeout(() => {
      load();
    }, 1000);
  }, [globalCtx?.global, idNewsCategory]);
  return (
    <PageTransition effect="slideUp">
      <Main title="" titleClass="">
        <Helmet>
          <title>{`${import.meta.env.VITE_PROJECT_NAME} | ${
            newsPageInfo?.title
          }`}</title>
          <meta
            name="title"
            content={`${import.meta.env.VITE_PROJECT_NAME} | ${
              newsPageInfo?.title
            }`}
          />
          <meta
            name="description"
            content={newsPageInfo?.body
              .replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/^(.{150}[^\s]*).*/, "$1")
              .replace(/(\r\n|\n|\r)/gm, "")
              .replace("&nbsp;", "")}
          />
        </Helmet>
        <div className="container m-auto">
          <Link
            to={
              globalCtx?.global.lang === "Fr"
                ? "/en/page/news"
                : "/fr/page/nouvelles"
            }
            className="flex flex-wrap bg-eo_blue-200 text-white px-6 py-[0.1rem] w-[260px] leading-10 justify-center"
          >
            <span>
              <div
                className="text-4xl text-white mr-6"
                dangerouslySetInnerHTML={{ __html: "&#8592" }}
              />
            </span>
            {globalCtx?.global.lang === "Fr"
              ? "All News"
              : "Toutes les nouvelles"}
          </Link>
          <CustomBreadcrumb />
          <p className="border-l-[0.9rem] pl-2 text-xl text-black font-normal border-eo_blue-200 mb-12 mt-10">
            {category}
          </p>
          <div className="news-page-content px-[1.2rem] lg:px-[4rem]">
            <div
              className="px-4 pt-10 lg:px-20 text-sm overflow-hidden relative"
              id="title-transition-1"
            >
              <span className="logo absolute top-6">
                <img
                  className="float-right mr-6 -mt-2"
                  src={title_orange_logo}
                  alt="orange-line"
                />
              </span>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                className="relative"
              >
                <TitleTransition
                  id={1}
                  titleVariants={titleVariants}
                  title_left={0}
                  logo_top={0}
                  classTitle={"two-lines"}
                >
                  <h1 className="text-left py-2 text-3xl text-black mb-0 subtitle">
                    {newsPageInfo?.title}
                  </h1>
                </TitleTransition>
              </motion.div>
            </div>
            <small className="text-black font-bold">
              {moment(newsPageInfo?.creationDate).format("DD/MM/YYYY")}
            </small>
            <ul id="share-this" className="flex flex-wrap mt-8">
              <li>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                  target={"_blank"}
                >
                  <img
                    className="w-[30px]"
                    src={li_share_icon}
                    alt="share-icon"
                  />
                </a>
              </li>
              <li className="ml-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target={"_blank"}
                >
                  <img
                    className="w-[30px]"
                    src={fb_share_icon}
                    alt="facebook"
                  />
                </a>
              </li>
            </ul>
            <div className="body-container mt-6 lg:mt-20 pb-10">
              {image !== "" ? (
                <div className="image mb-6">
                  <LazyLoadImage src={image} effect="blur" />
                </div>
              ) : null}
              <div className="body text-black">
                <div
                  className="text-justify"
                  dangerouslySetInnerHTML={{ __html: newsPageInfo?.body! }}
                />
                <p className="text-normal mt-4">
                  <label className="font-bold">Date:</label>{" "}
                  {moment(newsPageInfo?.creationDate).format(
                    "dddd, MMMM Do YYYY"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="news-header relative h-[150px]">
            <BlockBlueTransition>
              {globalCtx?.global.lang === "Fr" ? (
                <p className="blue-block border-l-[0.9rem] pl-2 text-black font-normal border-eo_blue-200 mb-12 mt-10">
                  You would
                  <br />
                  also like
                </p>
              ) : (
                <p className="blue-block border-l-[0.9rem] pl-2 text-black font-normal border-eo_blue-200 mb-12 mt-10">
                  tu voudrais
                  <br />
                  aussi
                </p>
              )}
            </BlockBlueTransition>
          </div>
          <RelatedNews idNewsCategory={idNewsCategory} />
        </div>
        <ContactUs />
      </Main>
    </PageTransition>
  );
};

export default NewsPage;
