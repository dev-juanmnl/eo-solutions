import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlockSecondAnimationProps } from "../types/BlockSecondAnimationProps";
const SecondBlockTransition: React.FunctionComponent<
  BlockSecondAnimationProps
> = (props: BlockSecondAnimationProps) => {
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [blockPosition, setBlockPosition] = useState(props.top);
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
    let block_transition = document
      .getElementById(`block-${props.id}`)
      ?.querySelector(".inner-block");
    let new_block_position = 0;
    if (isScrollingDown()) {
      //------ Title position ---------
      new_block_position = blockPosition - 0.5;
    } else {
      //------ Title position ---------
      new_block_position = blockPosition + 0.5;
    }
    //------ Title position ---------
    triggerBlockAnimation(block_transition, new_block_position);
    setBlockPosition(new_block_position);
  };
  const triggerBlockAnimation = (element: any, position: any) => {
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
  }, [previousScrollPosition, blockPosition, props]);
  return <motion.div className="block-transition">{props.children}</motion.div>;
};

export default SecondBlockTransition;
