import React, { lazy, useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
import { motion, Variants } from "framer-motion";
import api from "../service/api";
import api_fr from "../service/api_fr";
const Main = lazy(() => import("./MainLayout"));
const HeroImage = lazy(() => import("../blocks/HeroImage"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const BlockBlueTransition = lazy(
  () => import("../animations/BlockBlueTransition")
);
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
const SecondBlockTransition = lazy(
  () => import("../animations/SecondBlockTransition")
);
import customer_icon from "@/assets/images/customer-icon-orange.svg";
import ContactUs from "../blocks/ContactUs";
import ServicesAccordeon from "../blocks/ServicesAccordeon";
const OurServices: React.FunctionComponent<PageInfoType> = (
  props: PageInfoType
) => {
  const globalCtx = useContext(GlobalContext);
  const [servicesList, setServicesList] = useState([]);
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
  const load = async () => {
    try {
      let url = import.meta.env.VITE_API_ALL_SERVICES;
      let result: any = null;
      if (globalCtx?.global.lang === "Fr") result = await api.get(url);
      else result = await api_fr.get(url);
      setServicesList(result.data.data);
      let block_url = import.meta.env.VITE_API_BLOCKS;
      let block_blue_services = import.meta.env
        .VITE_API_BLOCK_SERVICES_BLUE_LEFT;
      if (globalCtx?.global.lang !== "Fr")
        block_blue_services = import.meta.env
          .VITE_API_BLOCK_SERVICES_BLUE_LEFT_FR;
      //--------- Block footer one ---------
      getBlockInformation(
        block_url,
        block_blue_services,
        "blue_left",
        globalCtx?.global.lang!
      );
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  const getBlockInformation = async (
    block_url: string,
    block_id: string,
    block_name: string,
    lang: string
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
  }, [globalCtx?.global]);
  return (
    <Main title="" titleClass="">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} | {props.title}
        </title>
        <meta name="description" content={props.metaDescription} />
      </Helmet>
      <h1 className="text-center py-4 text-eo_orange uppercase">
        {props.title}
      </h1>
      <HeroImage url={props.image} />
      <div className="w-full container m-auto">
        <CustomBreadcrumb />
      </div>
      <div className="our-services-page page-content container m-auto relative overflow-hidden">
        <div
          className="content-header page-content grid grid-cols-8 pt-16 relative overflow-hidden"
          id="title-transition-1"
        >
          <span className="col-span-2 logo">
            <img
              className="float-right mr-8 mt-[10px]"
              src={customer_icon}
              width="104px"
              height="142px"
              alt="customer-icon"
            />
          </span>
          <motion.div
            className="col-span-6 relative"
            initial="offscreen"
            whileInView="onscreen"
          >
            <TitleTransition
              id={1}
              titleVariants={titleVariants}
              title_left={0}
              logo_top={0}
              classTitle={"tree-lines"}
            >
              <div dangerouslySetInnerHTML={{ __html: props.body }} />
            </TitleTransition>
          </motion.div>
        </div>
        <div id="block-1" className="container m-auto mb-10 mt-10">
          <ServicesAccordeon fromHomePage={false} />
        </div>
        <BlockBlueTransition>
          <div
            className="blue-block"
            dangerouslySetInnerHTML={{ __html: blockBlueLeft }}
          />
        </BlockBlueTransition>
        <div id="services-list" className="container m-auto mt-40">
          {servicesList.map((item: any, index) =>
            item.attributes.langcode !==
            globalCtx?.global.lang.toLowerCase() ? (
              <div
                className="service-box shadow-box px-10 py-10 mb-10"
                key={`service-${index}`}
                id={`anchor-${item.id}`}
              >
                <h3 className="text-eo_blue-200 mb-10 service-title text-center">
                  {item.attributes.title}
                </h3>
                <div className="service-description mb-7">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.attributes.body.value,
                    }}
                  ></div>
                </div>
              </div>
            ) : null
          )}
        </div>
        <ContactUs />
      </div>
    </Main>
  );
};

export default OurServices;
