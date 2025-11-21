import { motion } from "framer-motion";
const ButtonTransitionWithLink: React.FunctionComponent<{
  text: string;
  url: string;
}> = ({ text, url }) => {
  return (
    <div className="button-animated--wrapper">
      <motion.button
        className="btn-animated shadow-button flex flex-wrap leading-7 mt-10 btn rounded-none bg-transparent border-none capitalize text-black font-normal"
        onClick={() => {
          if (url !== null) window.location.replace(url!);
        }}
      >
        <span className="btn-text">{text}</span>
        <span className="btn-arrow text-2xl ml-3 text-eo_orange">
          <div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
        </span>
      </motion.button>
    </div>
  );
};
export default ButtonTransitionWithLink;
