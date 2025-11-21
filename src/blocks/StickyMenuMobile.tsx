import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import fb_icon from "@/assets/images/fb-orange.svg";
import li_icon from "@/assets/images/linkedin-orange.svg";
const StickyMenuMobile = () => {
  const globalCtx = useContext(GlobalContext);
  return (
    <ul
      id="sticky-menu-mobile"
      className="w-[86%] left-5 absolute bottom-10 h-[150px]"
    >
      <li className="col-span-1 relative mb-1">
        <Link
          to={
            globalCtx?.global.lang === "Fr"
              ? "/en/contact-us"
              : "/fr/nous-contacter"
          }
          className="block text-white text-center leading-10 w-full py-[5px] px-5 h-[45px] bg-eo_gray_sticky relative"
        >
          {globalCtx?.global.lang === "Fr" ? "Contact Us" : "Nous contacter"}
        </Link>
      </li>
      <li className="col-span-1 relative mb-1">
        <Link
          to=""
          className="block text-white text-center h-[45px] w-full leading-10 bg-eo_orange py-[5px] px-5 relative"
        >
          Brochure
        </Link>
      </li>
      <li className="col-span-1 relative mb-1 bg-eo_gray_sticky">
        <div className="m-auto flex flex-wrap h-[45px] py-[5px] relative w-[102px]">
          <a
            href={import.meta.env.VITE_SOCIAL_LINK_FACEBOOK}
            target={"_blank"}
            className="inline-block mx-2"
          >
            <img className="w-[35px]" src={fb_icon} alt="facebook" />
          </a>
          <a
            href={import.meta.env.VITE_SOCIAL_LINK_LINKEDIN}
            target={"_blank"}
            className="inline-block mx-2"
          >
            <img className="w-[35px]" src={li_icon} alt="linkedin" />
          </a>
        </div>
      </li>
    </ul>
  );
};

export default StickyMenuMobile;
