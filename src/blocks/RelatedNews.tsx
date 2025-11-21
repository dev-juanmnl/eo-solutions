import { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import api from "../service/api";
import api_fr from "../service/api_fr";
import { Link } from "react-router-dom";
import { RelatedNewsProps } from "../types/RelatedNewsProps";
import NewsButtonTransition from "../animations/NewsButtonTransition";
import Carousel from "react-multi-carousel";
import { isMobile } from "react-device-detect";
const RelatedNews: React.FunctionComponent<RelatedNewsProps> = (
  props: RelatedNewsProps
) => {
  const globalCtx = useContext(GlobalContext);
  const [relatedNews, setRelatedNews] = useState([]);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
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
      let related_news_response: any = null;
      let url_articles = import.meta.env.VITE_API_ALL_ARTICLES;
      let filter = `filter[field_news_categories.meta.drupal_internal__target_id][value]=${props.idNewsCategory}`;
      let sort =
        "sort[sort-created][path]=created&sort[sort-created][direction]=DESC";
      url_articles += `?${filter}&${sort}`;
      if (globalCtx?.global.lang === "Fr")
        related_news_response = await api.get(url_articles);
      else related_news_response = await api_fr.get(url_articles);
      setRelatedNews(related_news_response.data.data);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
  }, [globalCtx?.global, props.idNewsCategory]);
  return (
    <motion.div
      id="related-news-list"
      className="mb-10"
      initial="offscreen"
      whileInView="onscreen"
    >
      <motion.div variants={blockVariants}>
        <Carousel
          ssr
          partialVisbile
          itemClass="image-item"
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          className="pt-3"
          showDots={isMobile ? false : true}
        >
          {relatedNews?.map((item: any, i) => (
            <div
              className="news-teaser col-span-1 shadow-box py-6 px-10 mb-10 mx-4 overflow-hidden"
              key={`related-news-${i}`}
            >
              <h3 className="text-eo_blue-200 text-2xl text-center mb-8">
                <Link to={`${item.attributes.path.alias}`}>
                  {item.attributes.title}
                </Link>
              </h3>
              <div className="body-summary text-sm text-black">
                <div
                  className="text-justify"
                  dangerouslySetInnerHTML={{
                    __html: item.attributes.body.summary,
                  }}
                />
                <NewsButtonTransition url={`${item.attributes.path.alias}`}>
                  Read more
                </NewsButtonTransition>
              </div>
            </div>
          ))}
        </Carousel>
      </motion.div>
    </motion.div>
  );
};

export default RelatedNews;
