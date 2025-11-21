import React, { useState, useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GlobalContext } from "../context/Global";
import api from "../service/api";
import api_fr from "../service/api_fr";
import { OurServicesAccordeonProps } from "../types/OurServicesAccordeonProps";
const ServicesAccordeon: React.FunctionComponent<OurServicesAccordeonProps> = (
  props: OurServicesAccordeonProps
) => {
  const globalCtx = useContext(GlobalContext);
  const [servicesList, setServicesList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const load = async () => {
    try {
      let url = import.meta.env.VITE_API_ALL_SERVICES;
      let result: any = null;
      if (globalCtx?.global.lang === "Fr") result = await api.get(url);
      else result = await api_fr.get(url);
      setServicesList(result.data.data);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  const triggerAnchor = (e, id) => {
    e.preventDefault();
    activateAnchor(id);
  };
  const activateAnchor = (id) => {
    let serviceBox = document.getElementById(`anchor-${id}`);
    let y = 0;
    if (serviceBox !== undefined)
      y = serviceBox!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  useEffect(() => {
    load();
    //validate if the param anchor exists
    let anchor = searchParams.get("anchor");
    if (anchor !== null) {
      setTimeout(() => {
        activateAnchor(anchor);
      }, 1000);
    }
  }, [globalCtx?.global]);
  return (
    <div
      id="services-accordion"
      className="pl-6 pt-4 sm:pl-14 sm:pt-8 xl:pl-28 xl:pt-20 pr-6 pb-6 bg-eo_gray_products text-black"
    >
      {servicesList.map((item: any, index) =>
        item.attributes.langcode !== globalCtx?.global.lang.toLowerCase() ? (
          <div
            className="collapse collapse-plus border-b-2 border-white"
            key={`service-${index}`}
          >
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-xl font-bold">
              {item.attributes.title}
            </div>
            <div className="collapse-content">
              <div className="small-description mb-7 font-bold">
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.attributes.body.summary,
                  }}
                ></div>
              </div>
              {!props.fromHomePage ? (
                <a href="" onClick={(e) => triggerAnchor(e, item.id)}>
                  {globalCtx?.global.lang === "Fr"
                    ? "Read more"
                    : "En savoir plus"}
                </a>
              ) : (
                <Link
                  to={
                    globalCtx?.global.lang === "Fr"
                      ? `/en/page/our-services?anchor=${item.id}`
                      : `/fr/page/nos-services?anchor=${item.id}`
                  }
                >
                  {globalCtx?.global.lang === "Fr"
                    ? "Read more"
                    : "En savoir plus"}
                </Link>
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default ServicesAccordeon;
