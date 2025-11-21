import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import { ButtonTransitionProps } from "../types/ButtonTransitionProps";
const BlockBlueTransition: React.FunctionComponent<ButtonTransitionProps> = (
  props: ButtonTransitionProps
) => {
  return (
    <motion.div
      className="w-full lg:w-[650px] absolute"
      initial={{ left: isMobile ? -300 : -650 }}
      whileInView={{ left: 0, transition: { duration: 1 } }}
    >
      {props.children}
    </motion.div>
  );
};

export default BlockBlueTransition;
