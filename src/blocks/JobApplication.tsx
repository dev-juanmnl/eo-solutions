import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
const JobApplication = () => {
  const globalCtx = useContext(GlobalContext);
  useEffect(() => {}, [globalCtx?.global]);
  return (
    <div className="contact-us-wrapper w-full sm:w-[60%] mt-4 lg:mt-10 m-auto bg-eo_gray_sticky py-12">
      <Link
        className="btn rounded-none border-none bg-eo_blue-200 capitalize font-light text-lg m-auto block w-[280px] leading-[45px]"
        to="mailto:te-hr@harelmallac.com?subject=Spontaneous%20Application"
      >
        {globalCtx?.global.lang === "Fr"
          ? "Spontaneous application"
          : "Candidature spontanée"}
      </Link>
      <p className="text-black font-bold text-2xl uppercase text-center mt-8">
        {globalCtx?.global.lang === "Fr"
          ? "For other career opportunities"
          : "Pour d'autres opportunités de carrière"}
      </p>
    </div>
  );
};

export default JobApplication;
