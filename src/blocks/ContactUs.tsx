import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
const ContactUs = () => {
  const globalCtx = useContext(GlobalContext);
  useEffect(() => {}, [globalCtx?.global]);
  return (
    <div className="contact-us-wrapper w-full sm:w-[60%] m-auto bg-eo_gray_sticky py-12 mt-0 lg:mt-4">
      <Link
        className="btn rounded-none border-none bg-eo_blue-200 capitalize font-light text-lg m-auto block w-[150px] leading-10"
        to={
          globalCtx?.global.lang === "Fr"
            ? "/en/contact-us"
            : "/fr/nous-contacter"
        }
      >
        {globalCtx?.global.lang === "Fr" ? "Contact Us" : "Nous contacter"}
      </Link>
      <p className="text-black font-bold text-[1.2rem] lg:text-2xl uppercase text-center mt-8">
        {globalCtx?.global.lang === "Fr"
          ? "Our experts are at your service"
          : "Nos experts sont à votre service"}
      </p>
    </div>
  );
};

export default ContactUs;
