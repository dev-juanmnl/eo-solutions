import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/Global";
import { useLocation, Link } from "react-router-dom";

const CustomBreadcrumb = () => {
  const globalCtx = useContext(GlobalContext);
  const [lang, setLang] = useState(sessionStorage.getItem("lang"));
  const location = useLocation();
  const [pathNames, setPathNames] = useState<any[]>([]);

  const load = () => {
    let path_name: any[] = location.pathname.split("/").filter(Boolean);
    if (window.history.state.url !== undefined)
      path_name = window.history.state.url.split("/").filter(Boolean);
    setLang(sessionStorage.getItem("lang"));
    setPathNames(path_name);
  };

  const processName = (value: string) => {
    let first_letter = value.charAt(0);
    let rest = value.substring(1, value.length);
    rest = rest.replaceAll("-", " ");
    let process_name = first_letter.toUpperCase() + rest;
    return process_name;
  };

  useEffect(() => {
    load();
  }, [window.history.state]);

  return (
    <ul className="pl-2 lg:pl-0 mt-4 text-sm flex flex-wrap list-none breadcrumb">
      {pathNames.length ? (
        <li>
          <Link to="/">{`${
            globalCtx?.global.lang === "Fr" ? "Home" : "Accueil"
          }`}</Link>
          <span className="px-2">/</span>
        </li>
      ) : (
        <li>
          <span>{`${
            globalCtx?.global.lang === "Fr" ? "Home" : "Accueil"
          }`}</span>
        </li>
      )}
      {pathNames.map((name: any, index: any) => {
        const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathNames.length - 1;
        return routeTo !== `/${lang?.toLowerCase()}/page` &&
          routeTo !== `/${lang?.toLowerCase()}` ? (
          isLast ? (
            <li key={`breadcrumb-${index}`}>
              <span>{`${processName(name).split("?")[0]}`}</span>{" "}
            </li>
          ) : (
            <li key={`breadcrumb-${index}`}>
              <Link to={routeTo}>{`${processName(name)}`}</Link>{" "}
              <span className="px-2">/</span>
            </li>
          )
        ) : null;
      })}
    </ul>
  );
};

export default CustomBreadcrumb;
