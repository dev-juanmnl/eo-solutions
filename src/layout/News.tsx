import { useEffect, useState, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
import api from "../service/api";
import api_fr from "../service/api_fr";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
import texts from "../texts.json";

const Main = lazy(() => import("./MainLayout"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const ContactUs = lazy(() => import("../blocks/ContactUs"));
const NewsCategories = lazy(() => import("../blocks/NewsCategories"));
const NewsButtonTransition = lazy(
  () => import("../animations/NewsButtonTransition")
);
const BlockBlueTransition = lazy(
  () => import("../animations/BlockBlueTransition")
);
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
const News: React.FunctionComponent<PageInfoType> = (props: PageInfoType) => {
  const globalCtx = useContext(GlobalContext);
  const [newsList, setNewsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blockBlueLeft, setBlockBlueLeft] = useState("");
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
      let response: any = null;
      let url = import.meta.env.VITE_API_ALL_ARTICLES;
      let block_url = import.meta.env.VITE_API_BLOCKS;
      let block_blue_left = import.meta.env.VITE_API_BLOCK_NEWS_BLUE_LEFT;
      let filter = "";
      let sort =
        "sort[sort-created][path]=created&sort[sort-created][direction]=DESC";
      //--------- Category list ---------
      if (selectedCategory !== "all")
        filter = `filter[field_news_categories.meta.drupal_internal__target_id][value]=${selectedCategory}`;

      if (filter !== "") url = `${url}?${filter}&${sort}`;
      else url = `${url}?${sort}`;

      if (globalCtx?.global.lang === "Fr") response = await api.get(url);
      else {
        response = await api_fr.get(url);
        block_blue_left = import.meta.env.VITE_API_BLOCK_NEWS_BLUE_LEFT_FR;
      }
      setNewsList(response.data.data);
      sessionStorage.setItem("news_list", JSON.stringify(response));
      //--------- Block blue left ---------
      getBlockInformation(
        block_url,
        block_blue_left,
        "blue_left",
        globalCtx?.global.lang
      );
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  const updateSelectedCategory = (value: string) => {
    setSelectedCategory(value);
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
    load();
  }, [selectedCategory, globalCtx?.global]);
  return (
    <Main title="" titleClass="">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {props.title}
        </title>
        <meta
          name="title"
          content={`${import.meta.env.VITE_PROJECT_NAME} | ${props.title}`}
        />
        <meta name="description" content={texts.news.seo.description} />
      </Helmet>
      <div className="w-full container m-auto">
        <CustomBreadcrumb />
      </div>
      <div className="news-page page-conntennt container m-auto relative overflow-hidden">
        <div
          className="px-4 pt-20 pb-20 lg:px-36 text-sm mb-6 overflow-hidden relative"
          id="title-transition-1"
        >
          <motion.span
            className="logo absolute top-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1, transition: { duration: 1 } }}
          >
            <img
              className="float-right mr-6 -mt-2"
              src={title_orange_logo}
              alt="orange-line"
            />
          </motion.span>
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            className="relative"
          >
            <TitleTransition
              id={1}
              titleVariants={titleVariants}
              title_left={50}
              logo_top={0}
              classTitle={"two-lines"}
            >
              <div dangerouslySetInnerHTML={{ __html: props.body }} />
            </TitleTransition>
          </motion.div>
        </div>
        <BlockBlueTransition>
          <div
            className="blue-block"
            dangerouslySetInnerHTML={{ __html: blockBlueLeft }}
          />
        </BlockBlueTransition>
        <NewsCategories
          selectedCategory={selectedCategory}
          updateSelectedCategory={updateSelectedCategory}
        />
        <div
          id="news-list"
          className="masonry sm:masonry-sm md:masonry-md xl:masonry-xl my-12 p-2 pt-10"
        >
          {newsList.map((news: any, index) => (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              className="overflow-hidden p-2"
              key={`news-teaser-${index}`}
            >
              <motion.div
                className="news-teaser w-full shadow-box py-6 px-4 lg:px-6 xl:px-10 mb-6 break-inside"
                variants={blockVariants}
              >
                <Link to={`${news.attributes.path.alias}`}>
                  <h3 className="text-eo_blue-200 text-2xl text-center mb-8">
                    {news.attributes.title}
                  </h3>
                </Link>
                <div className="body-summary text-sm text-black">
                  <div
                    className="text-justify"
                    dangerouslySetInnerHTML={{
                      __html:
                        news.attributes.body !== null
                          ? news.attributes.body.summary
                          : "",
                    }}
                  ></div>
                  <NewsButtonTransition url={`${news.attributes.path.alias}`}>
                    Read more
                  </NewsButtonTransition>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <ContactUs />
      </div>
    </Main>
  );
};

export default News;
