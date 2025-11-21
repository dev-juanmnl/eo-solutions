import { motion } from "framer-motion";
import { ButtonTransitionProps } from "../types/ButtonTransitionProps";
const ButtonTransition: React.FunctionComponent<ButtonTransitionProps> = (
  props: ButtonTransitionProps
) => {
  return (
    <div className="button-animated--wrapper">
      <motion.button className="btn-animated shadow-button flex flex-wrap leading-7 mt-10 btn rounded-none bg-transparent border-none capitalize text-black font-normal">
        <span className="btn-text">{props.children}</span>
        <span className="btn-arrow text-2xl ml-3 text-eo_orange">
          <div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
        </span>
      </motion.button>
    </div>
  );
};
export default ButtonTransition;
