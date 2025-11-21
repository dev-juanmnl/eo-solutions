import { useEffect, useState, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
const Main = lazy(() => import("./MainLayout"));
const HeroImage = lazy(() => import("../blocks/HeroImage"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const Careers: React.FunctionComponent<PageInfoType> = (
  props: PageInfoType
) => {
  const globalCtx = useContext(GlobalContext);
  useEffect(() => {
    let main = document.getElementById("main");
    const script = document.createElement("script");
    script.src = "https://apps.elfsight.com/p/platform.js";
    script.defer = true;
    script.async = true;
    main?.appendChild(script);
  }, [globalCtx?.global]);
  return (
    <Main title="" titleClass="">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {props.title}
        </title>
        <meta name="description" content={props.metaDescription} />
      </Helmet>
      <section id="hero" className="container m-auto">
        <HeroImage url={props.image} />
        <CustomBreadcrumb />
      </section>
      <div className="container m-auto px-4 py-4" id="main">
        <div className="elfsight-app-d3f6e78a-806e-492e-8bb2-d4fe0fec63e9"></div>
      </div>
    </Main>
  );
};

export default Careers;
