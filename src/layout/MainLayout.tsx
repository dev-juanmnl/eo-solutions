import React, { useState, lazy } from "react";
import { ContentProps } from "../types/ContentProps";
import Header from "./Header";
import Footer from "./Footer";
import Overlay from "./Overlay";
import LateralMenu from "../blocks/LateralMenu";

const Main: React.FunctionComponent<ContentProps> = (props: ContentProps) => {
  const [menuActive, setMenuActive] = useState(false);
  const activateMenu = (value: boolean) => {
    setMenuActive(value);
  };
  return (
    <>
      <Header isActive={menuActive} setActive={activateMenu} />
      <div id="page-content-wrapper">
        <div className="">
          <section id="main-content">{props.children}</section>
        </div>
      </div>
      <Overlay isActive={menuActive} setActive={activateMenu} />
      <LateralMenu isActive={menuActive} setActive={activateMenu} />
      <Footer />
    </>
  );
};

export default Main;
