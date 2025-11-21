import { useContext, useState } from "react";
import { GlobalContext } from "../context/Global";
import { ProductListProps } from "../types/ProductListProps";
const ProductFilter: React.FunctionComponent<ProductListProps> = (
  props: ProductListProps
) => {
  const globalCtx = useContext(GlobalContext);
  return (
    <div className="filter flex flex-wrap py-4 px-4">
      <label className="w-full lg:w-auto mr-8 py-2 text-sm text-black lg:ml-10">
        {globalCtx?.global.lang === "Fr" ? "Filters" : "Filtres"}:{" "}
      </label>
      <div className="select-group w-full">
        <form
          action="#"
          id="filter"
          onSubmit={() => {
            props.resetFilter();
          }}
        >
          <select
            className="p-2 pr-6 text-sm border border-gray-400 lg:mr-10 w-full sm:w-[180px] md:w-[120px] md:text-xs lg:text-sm lg:w-[140px] xl:w-[180px] sm:mr-[2px] md:mr-[2px] mb-1 lg:mb-0"
            onChange={(e) => props.updateFilter(e.target.value, "subtitle")}
            id="filter-subtitle"
          >
            <option value="all">
              {globalCtx?.global.lang === "Fr"
                ? "All Subtitles"
                : "Tous les sous-titres"}
            </option>
            {props.subtitles.map((item, i) => (
              <option key={`subtitle-${i}`} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 pr-6 text-sm border border-gray-400 lg:mr-10 w-full sm:w-[180px] md:w-[120px] md:text-xs lg:text-sm lg:w-[140px] xl:w-[180px] sm:mr-[2px] md:mr-[2px] mb-1 lg:mb-0"
            onChange={(e) => props.updateFilter(e.target.value, "brand")}
            id="filter-brand"
          >
            <option value="all">
              {globalCtx?.global.lang === "Fr"
                ? "All Brands"
                : "Toutes les marques"}
            </option>
            {props.brands.map((item, i) => (
              <option key={`brand-${i}`} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 pr-6 text-sm border border-gray-400 lg:mr-10 w-full sm:w-[180px] md:w-[120px] md:text-xs lg:text-sm lg:w-[140px] xl:w-[180px] sm:mr-[2px] md:mr-[2px] mb-1 lg:mb-0"
            onChange={(e) => props.updateFilter(e.target.value, "category")}
            id="filter-category"
          >
            <option value="all">
              {globalCtx?.global.lang === "Fr"
                ? "All Categories"
                : "Toutes catégories"}
            </option>
            {props.categories.map((item, i) => (
              <option key={`category-${i}`} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            className="btn rounded-none mb-4 bg-eo_blue-200 border-none h-[2.3rem] min-h-[2.3rem]"
            type="submit"
          >
            {globalCtx?.global.lang === "Fr"
              ? "Reset filter"
              : "Réinitialiser le filtre"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFilter;
