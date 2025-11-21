import { motion } from "framer-motion";
import { BlockProps } from "../types/BlockProps";
const BlockTransition: React.FunctionComponent<BlockProps> = (
  props: BlockProps
) => {
  return (
    <motion.div
      className={props.classes}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1, transition: { duration: 1 } }}
    >
      {props.children}
    </motion.div>
  );
};

export default BlockTransition;
