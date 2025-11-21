import { useState, useEffect, useContext } from "react";
import { NewsCategoriesProps } from "../types/NewsCategoriesProps";
import api from "../service/api";
import api_fr from "../service/api_fr";
import { GlobalContext } from "../context/Global";
const NewsCategories: React.FunctionComponent<NewsCategoriesProps> = (
  props: NewsCategoriesProps
) => {
  const globalCtx = useContext(GlobalContext);
  const [newsCategories, setNewsCategories] = useState([]);
  const load = async () => {
    try {
      let response: any = null;
      if (globalCtx?.global.lang === "Fr")
        response = await api.get(import.meta.env.VITE_API_NEWS_CATEGORIES);
      else
        response = await api_fr.get(import.meta.env.VITE_API_NEWS_CATEGORIES);
      setNewsCategories(response.data.data);
      sessionStorage.setItem(
        "news_categories",
        JSON.stringify(response.data.data)
      );
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
  }, [props.selectedCategory, globalCtx?.global]);
  if (newsCategories.length > 0) {
    return (
      <ul id="news-categories" className="flex flex-wrap mb-12 mt-28">
        {newsCategories.map((news_category: any, index) => (
          <li
            key={`news-category-${index}`}
            className="border border-black px-6 py-1 mr-2 cursor-pointer"
            onClick={() =>
              props.updateSelectedCategory(
                news_category.attributes.drupal_internal__tid
              )
            }
          >
            <span>{news_category.attributes.name}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <></>;
};

export default NewsCategories;
