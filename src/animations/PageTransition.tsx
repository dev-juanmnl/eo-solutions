import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransitionProps } from "../types/PageTransitionProps";
import logo from "@/assets/images/logo.svg";
const PageTransition: React.FunctionComponent<PageTransitionProps> = (
  props: PageTransitionProps
) => {
  const [pageAnimationConfiguration, setPageAnimationConfiguration] =
    useState();
  const [grayBox, setGrayBox] = useState({
    initial: {
      height: "100vh",
    },
    animate: {
      transition: {
        duration: 1,
      },
      height: 0,
    },
  });
  useEffect(() => {
    let page_animation: any = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 2 } },
      exit: { opacity: 0 },
    };
    if (props.effect === "slideUp") {
      page_animation = {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 },
        transition: { duration: 1 },
      };
    }
    setPageAnimationConfiguration(page_animation);
  }, [props.effect]);
  return (
    <>
      <div className="absolute inset-0 100vh">
        <motion.div
          className="relative z-50 grid grid-cols-1 items-center bg-eo_gray_footer overflow-hidden"
          initial="initial"
          animate="animate"
          variants={grayBox}
        >
          <motion.img
            initial="hidden"
            whileInView={{ opacity: 1 }}
            className="w-[100px] lg:w-[150px] absolute top-[35%] left-[35%] lg:top-[35%] lg:left-[45%]"
            src={logo}
            alt="logo"
          />
        </motion.div>
      </div>
      <motion.div
        variants={pageAnimationConfiguration}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 3 }}
        className="relative"
        id="page-body"
      >
        {props.children}
      </motion.div>
    </>
  );
};
export default PageTransition;
