import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
const Breadcrumb = () => {
  const globalCtx = useContext(GlobalContext);
  const [lang, setLang] = useState(sessionStorage.getItem("lang"));
  const breadcrumbs = useBreadcrumbs();
  useEffect(() => {}, [globalCtx?.global]);
  return (
    <div className="breadcrumb text-xs text-eo_gray_footer py-3 flex flex-wrap px-2 lg:px-0">
      {breadcrumbs.map(({ match, breadcrumb }) =>
        match.pathname !== `/${lang?.toLowerCase()}/page` &&
        match.pathname !== `/${lang?.toLowerCase()}` ? (
          <div key={match.pathname}>
            <Link to={match.pathname} className="capitalize">
              {breadcrumb}
            </Link>
            <span className="px-2">/</span>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Breadcrumb;
