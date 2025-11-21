import { useContext, lazy } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
const Main = lazy(() => import("../layout/MainLayout"));
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
const NotFound = () => {
  const globalCtx = useContext(GlobalContext);
  const titleVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 15,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 1.2,
      },
    },
  };
  return (
    <Main title="404 Not Found" titleClass="">
      <div id="not-found-page" className="container m-auto pb-12">
        <motion.div>
          <div
            className="px-4 pt-20 pb-0 lg:px-36 text-sm mb-6 overflow-hidden relative"
            id="title-transition-1"
          >
            <motion.span
              className="logo absolute top-8"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1, transition: { duration: 1 } }}
            >
              <img
                className="float-right mr-6 -mt-2"
                src={title_orange_logo}
                alt="orange-line"
              />
            </motion.span>
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              className="relative"
            >
              <TitleTransition
                id={1}
                titleVariants={titleVariants}
                title_left={50}
                logo_top={0}
                classTitle={"one-line"}
              >
                <h1 className="uppercase font-light ml-0 mb-2 subtitle">
                  {globalCtx?.global.lang === "Fr"
                    ? "Page not found"
                    : "Page non trouvée"}
                </h1>
              </TitleTransition>
            </motion.div>
            {globalCtx?.global.lang === "Fr" ? (
              <div className="text-lg">
                <p className="mb-6">You are looking for a page that:</p>
                <ul className="list-disc pl-6 mb-10">
                  <li>did not exist or</li>
                  <li>no longer exists and has been removed</li>
                </ul>
                <p>Let's get you back on track.</p>
                <p>
                  <Link
                    to="/"
                    className="btn capitalize rounded-none mt-4 bg-eo_blue-200 text-white"
                  >
                    Take me home
                  </Link>
                </p>
              </div>
            ) : (
              <div className="text-lg">
                <p className="mb-6">La page que vous cherchez:</p>
                <ul className="list-disc pl-6 mb-10">
                  <li>n'a jamais existé ou</li>
                  <li>n'existe plus</li>
                </ul>
                <p>Remettons-nous sur la bonne voie.</p>
                <p>
                  <Link
                    to="/"
                    className="btn capitalize rounded-none mt-4 bg-eo_blue-200 text-white"
                  >
                    Retournons à la case
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Main>
  );
};

export default NotFound;
