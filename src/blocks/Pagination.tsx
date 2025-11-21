import { useEffect, useContext } from "react";
import { PaginationProps } from "../types/PaginationProps";
import { GlobalContext } from "../context/Global";

const Pagination: React.FunctionComponent<PaginationProps> = (
  props: PaginationProps
) => {
  const globalCtx = useContext(GlobalContext);
  useEffect(() => {}, [props.next, props.prev, props.last, props.first]);

  return (
    <div className="flex flex-wrap m-auto w-full lg:w-[250px] bg-white text-sm mt-10">
      {props.prev !== "" ||
      props.next !== "" ||
      props.last !== "" ||
      props.first !== "" ? (
        <>
          {/* <button
            id="first"
            className={`${
              props.first === "" ? "opacity-50" : ""
            } p-3 ml-4 bg-white text-brinks_blue-300 font-semibold hover:bg-eo_gray_footer hover:text-white`}
            onClick={() => props.changeCurrentPage(props.first)}
            disabled={props.first === "" ? true : false}
          >
            {" ← "}
            {globalCtx?.global.lang !== "Fr" ? "Premier" : "First"}
          </button> */}
          <button
            id="prev"
            className={`${
              props.prev === "" ? "opacity-50" : ""
            } p-3 bg-white ml-4 text-brinks_blue-300 font-semibold hover:bg-eo_gray_footer hover:text-white`}
            onClick={() => props.changeCurrentPage(props.prev)}
            disabled={props.prev === "" ? true : false}
          >
            {globalCtx?.global.lang !== "Fr" ? "Précédent" : "Previous"}
          </button>
          <button
            id="next"
            className={`${
              props.next === "" ? "opacity-50" : ""
            } p-3 ml-4 bg-white text-brinks_blue-300 font-semibold hover:bg-eo_gray_footer hover:text-white`}
            onClick={() => props.changeCurrentPage(props.next)}
            disabled={props.next === "" ? true : false}
          >
            {globalCtx?.global.lang !== "Fr" ? "Suivant" : "Next"}
          </button>
          {/* <button
            id="last"
            className={`${
              props.last === "" ? "opacity-50" : ""
            } p-3 ml-4 bg-white text-brinks_blue-300 font-semibold hover:bg-eo_gray_footer hover:text-white`}
            onClick={() => props.changeCurrentPage(props.last)}
            disabled={props.last === "" ? true : false}
          >
            {globalCtx?.global.lang !== "Fr" ? "Dernier" : "Last"} {" → "}
          </button> */}
        </>
      ) : null}
    </div>
  );
};

export default Pagination;
