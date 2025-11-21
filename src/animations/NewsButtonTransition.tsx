import { Link } from "react-router-dom";
import { NewsButtonPrpos } from "../types/NewsButtonProps";
const NewsButtonTransition: React.FunctionComponent<NewsButtonPrpos> = (
  props: NewsButtonPrpos
) => {
  return (
    <div className="button-animated--wrapper">
      <Link
        to={props.url}
        className="btn-animated-news flex flex-wrap leading-6 px-3 sm:px-2 py-3 sm:py-2 border border-gray-200 w-[160px] justify-center text-eo_orange mt-4"
      >
        <span className="btn-text">{props.children}</span>
        <span className="btn-arrow text-2xl ml-3 text-eo_orange">
          <div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
        </span>
      </Link>
    </div>
  );
};
export default NewsButtonTransition;
