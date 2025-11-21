import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import logo from "@/assets/images/logo.svg";
const OnMaintenancePage = () => {
  const globalCtx = useContext(GlobalContext);
  return (
    <div
      id="not-found-page"
      className="h-screen w-full grid grid-cols-1 content-center"
    >
      <Helmet>
        <title>{import.meta.env.VITE_PROJECT_NAME} | Under construction</title>
      </Helmet>
      <div className="page-500-container contaner m-auto col-span-1">
        <img src={logo} className="w-[250px] m-auto mb-10" alt="logo" />
        <h1 className="uppercase font-light text-center text-3xl">
          Web page under construction
        </h1>
        {globalCtx?.global.lang === "Fr" ? (
          <>
            <p className="text-xl mt-2 text-center">
              We thank you for your patience.
            </p>
          </>
        ) : (
          <>
            <p className="text-xl mt-10">
              Le site web ne peut afficher la page que vous essayez de
              consulter. Veuillez patienter quelques minutes avant de réessayer.
            </p>
            <p className="text-xl mt-2">
              Nous vous remercions de votre patience.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OnMaintenancePage;
