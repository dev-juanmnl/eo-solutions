import React, { useState, lazy } from "react";
import { ContentProps } from "../types/ContentProps";
const Header = lazy(() => import("../layout/Header"));
const Footer = lazy(() => import("../layout/Footer"));
const ProductCategories = lazy(() => import("../blocks/ProductCategories"));
const Overlay = lazy(() => import("../layout/Overlay"));
const LateralMenu = lazy(() => import("../blocks/LateralMenu"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));

const ProductCategoryLayout: React.FunctionComponent<ContentProps> = (
  props: ContentProps
) => {
  const [menuActive, setMenuActive] = useState(false);
  const activateMenu = (value: boolean) => {
    setMenuActive(value);
  };
  return (
    <>
      <Header isActive={menuActive} setActive={activateMenu} />
      <div id="page-content-wrapper">
        <div className="">
          <h1 className={props.titleClass}>{props.title}</h1>
          <div className="container m-auto md:grid md:grid-cols-4 pb-6 product-page-container">
            <div className="w-full md:col-span-4">
              <CustomBreadcrumb />
            </div>
            <section id="left-sidebar" className="md:col-span-1 py-2">
              <ProductCategories />
            </section>
            <section id="main-content" className="col-span-1 md:col-span-3 p-2">
              {props.children}
            </section>
          </div>
        </div>
      </div>
      <Overlay isActive={menuActive} setActive={activateMenu} />
      <LateralMenu isActive={menuActive} setActive={activateMenu} />
      <Footer />
    </>
  );
};

export default ProductCategoryLayout;
