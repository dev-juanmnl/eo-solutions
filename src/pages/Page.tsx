import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import { PageInfoType } from "../types/PageInfoType";
import { isMobileOnly, isTablet, isDesktop } from "react-device-detect";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import api from "../service/api";
import api_fr from "../service/api_fr";
import Main from "../layout/MainLayout";
import HeroImage from "../blocks/HeroImage";
import OurProducts from "../layout/OurProducts";
import OurServices from "../layout/OurServices";
import News from "../layout/News";
import Sustainability from "../layout/Sustainability";
import AboutUs from "../layout/AboutUs";
import SocialWall from "../layout/SocialWall";
import Careers from "../layout/Careers";
import ErrorPage from "./ErrorPage";
import PageTransition from "../animations/PageTransition";
import TitleTransition from "../animations/TitleTransition";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
import CustomBreadcrumb from "../components/CustomBreadcrumb";
import { truncateText, cleanHtmlTagsFromText } from "../helpers/Functions";

const Page = () => {
  const { alias } = useParams();
  const globalCtx = useContext(GlobalContext);
  const [metaDescription, setMetaDescription] = useState("");
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    title: "",
    body: "",
    second_body: "",
    third_body: "",
    image: "",
    alias: "",
    metaDescription: "",
  });
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
      let pages: any = sessionStorage.getItem("pages");
      let page_url = import.meta.env.VITE_API_ALL_PAGES;
      let include = "include=field_image";
      let current_page = window.location.pathname;
      pages = JSON.parse(pages!);
      for (let page of pages!) {
        let page_alias = page?.attributes.path.alias;
        if (page_alias !== null) {
          if (page_alias === current_page) {
            let page_request: any = null;
            if (globalCtx?.global.lang === "Fr")
              page_request = await api.get(
                `${page_url}/${page?.id}?${include}`
              );
            else
              page_request = await api_fr.get(
                `${page_url}/${page?.id}?${include}`
              );
            let data = {
              title: page_request.data.data.attributes.title,
              body:
                page_request.data.data.attributes.body !== null
                  ? page_request.data.data.attributes.body.value
                  : "",
              second_body:
                page_request.data.data.attributes.field_second_body !== null
                  ? page_request.data.data.attributes.field_second_body.value
                  : "",
              third_body:
                page_request.data.data.attributes.field_third_body !== null
                  ? page_request.data.data.attributes.field_third_body.value
                  : "",
              image: "",
              alias: `${page_request.data.data.attributes.path.alias}`,
              metaDescription:
                page_request.data.data.attributes.body !== null
                  ? page_request.data.data.attributes.body.summary
                    ? truncateText(
                        cleanHtmlTagsFromText(
                          page_request.data.data.attributes.body.value
                        ),
                        255
                      )
                    : page_request.data.data.attributes.body.summary
                  : "",
            };
            //set meta description
            setMetaDescription(page_request.data.data.attributes.body.summary);
            //------- get the image -------
            if (page_request.data.included !== undefined) {
              if (isMobileOnly)
                data.image =
                  page_request.data.included[0].attributes.image_style_uri.large;
              if (isTablet)
                data.image =
                  page_request.data.included[0].attributes.image_style_uri.wide;
              if (isDesktop)
                data.image = `${import.meta.env.VITE_DOMAIN_BACKEND}${
                  page_request.data.included[0].attributes.uri.url
                }`;
            }
            setPageInfo(data);
            //replace url
            let url = `${page_request.data.data.attributes.path.alias}`;
            const nextURL = url;
            const nextTitle = page_request.data.data.attributes.title;
            const nextState = {
              additionalInformation: "Updated the URL with JS",
              url: url,
            };
            window.history.replaceState(nextState, nextTitle, nextURL);
          }
        }
      }
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
  useEffect(() => {
    if (sessionStorage.getItem("pages") === null)
      globalCtx?.updatePagestList(globalCtx?.global.lang);
    setTimeout(() => {
      load();
    }, 1000);
  }, [globalCtx?.global]);
  // useEffect(() => {
  //   window.addEventListener("popstate", load);
  //   return () => {
  //     window.removeEventListener("popstate", load);
  //   };
  // }, []);
  if (showError)
    return (
      <PageTransition effect="opacity">
        <ErrorPage
          title="500 Error"
          body={errorMessage}
          second_body=""
          third_body=""
          image=""
          alias="/error"
          metaDescription=""
        />
      </PageTransition>
    );
  if (alias === "our-services" || alias === "nos-services")
    return (
      <PageTransition effect="opacity">
        <OurServices
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "our-solutions" || alias === "nos-produits")
    return (
      <PageTransition effect="opacity">
        <OurProducts
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          image={pageInfo.image}
          third_body={pageInfo.third_body}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "about-us" || alias === "a-propos")
    return (
      <PageTransition effect="opacity">
        <AboutUs
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "careers" || alias === "carrieres")
    return (
      <PageTransition effect="opacity">
        <Careers
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "news" || alias === "nouvelles")
    return (
      <PageTransition effect="opacity">
        <News
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "sustainability" || alias === "durabilite")
    return (
      <PageTransition effect="opacity">
        <Sustainability
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  if (alias === "social-wall" || alias === "reseau-social")
    return (
      <PageTransition effect="opacity">
        <SocialWall
          title={pageInfo.title}
          body={pageInfo.body}
          second_body={pageInfo.second_body}
          third_body={pageInfo.third_body}
          image={pageInfo.image}
          alias={pageInfo.alias}
          metaDescription={pageInfo.metaDescription}
        />
      </PageTransition>
    );
  return (
    <PageTransition effect="opacity">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {pageInfo.title}
        </title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <Main title="" titleClass="">
        <HeroImage url={pageInfo.image} />
        <div
          className="px-4 pt-20 pb-0 lg:px-36 text-sm mb-6 overflow-hidden relative"
          id="title-transition-1"
        >
          <span className="logo absolute top-8">
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
              title_left={50}
              logo_top={0}
              classTitle={"one-line"}
            >
              <h1 className="uppercase font-light ml-0 mb-12 subtitle  ">
                {pageInfo.title}
              </h1>
            </TitleTransition>
          </motion.div>
        </div>
        <div className="container m-auto page-content">
          <CustomBreadcrumb />
          <div dangerouslySetInnerHTML={{ __html: pageInfo.body }} />
        </div>
      </Main>
    </PageTransition>
  );
};

export default Page;
