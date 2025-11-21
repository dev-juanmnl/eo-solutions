import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import { TitleTransitionProps } from "../types/TitleTransitionProps";
const TitleTransition: React.FunctionComponent<TitleTransitionProps> = (
  props: TitleTransitionProps
) => {
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [titlePosition, setTitlePosition] = useState(props.title_left);
  const [logoPosition, setLogoPosition] = useState(props.logo_top);
  const isScrollingDown = () => {
    let goingDown = false;
    let scrollPosition = window.pageYOffset;
    if (scrollPosition > previousScrollPosition) {
      goingDown = true;
    }
    setPreviousScrollPosition(scrollPosition);
    return goingDown;
  };
  const handleScroll = () => {
    let title_transition = document
      .getElementById(`title-transition-${props.id}`)
      ?.querySelector(".subtitle");
    let logo_transition = document
      .getElementById(`title-transition-${props.id}`)
      ?.querySelector(".logo");
    let new_title_position = 0,
      new_logo_position = 0;
    if (isScrollingDown()) {
      //------ Title position ---------
      new_title_position = titlePosition - (isMobile ? 0.2 : 0.3);
      //------ Logo position ----------
      new_logo_position = logoPosition - 0.3;
    } else {
      //------ Title position ---------
      new_title_position = titlePosition + (isMobile ? 0.2 : 0.3);
      //------ Logo position ----------
      new_logo_position = logoPosition + 0.3;
    }
    //------ Title position ---------
    triggerTitleAnimation(title_transition, new_title_position);
    setTitlePosition(new_title_position);
    //------ Logo position ----------
    triggerLogoAnimation(logo_transition, logoPosition);
    setLogoPosition(new_logo_position);
  };
  const triggerTitleAnimation = (element: any, position: any) => {
    if (element !== undefined && element !== null) {
      element.style[
        "transform"
      ] = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${position}, 0, 0, 1)`;
    }
  };
  const triggerLogoAnimation = (element: any, position: any) => {
    if (element !== undefined && element !== null) {
      element.style[
        "transform"
      ] = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${position}, 0, 1)`;
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      handleScroll();
    });
  }, [previousScrollPosition, titlePosition, props]);
  return (
    <motion.div className={props.classTitle} variants={props.titleVariants}>
      {props.children}
    </motion.div>
  );
};

export default TitleTransition;
