import Main from "./Routes";
import { useEffect, useState } from "react";
import GlobalProvider from "./context/Global";
import { BrowserRouter } from "react-router-dom";
import StickyMenu from "./blocks/StickyMenu";
import "@/App.css";
import CookieConsent, { Cookies } from "react-cookie-consent";
function App() {
  const [showCookiesConfig, setShowCookiesConfig] = useState(false);
  const [showCookiesConcent, setShowCookiesConcent] = useState(false);
  useEffect(() => {
    if (Cookies.get("accept_cookie_consent") === "true") {
      setShowCookiesConcent(false);
    } else {
      setShowCookiesConcent(true);
    }
  }, []);
  return (
    <div className="App">
      <GlobalProvider>
        <BrowserRouter>
          <Main />
          <StickyMenu />
        </BrowserRouter>
      </GlobalProvider>
      {showCookiesConcent && (
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="accept_cookie_consent"
          style={{
            background: "#2B373B",
          }}
          buttonStyle={{
            color: "#fff",
            fontSize: "13px",
            backgroundColor: "#fa4616",
          }}
          expires={150}
        >
          <p className="text-white text-xs lg:text-sm">
            We use cookies on our website to give you the most relevant
            experience by remembering your preferences and repeat visits. By
            clicking “Accept”, you consent to the use of ALL the cookies.{" "}
          </p>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setShowCookiesConfig(true);
            }}
            className="bg-white text-black p-2 block text-sm w-[130px] text-center"
          >
            Cookie settings
          </a>
        </CookieConsent>
      )}
      {showCookiesConfig && (
        <div
          id="cookies-config"
          className="fixed top-[20%] left-[2%] lg:top-[32%] lg:left-[50%] w-[95%] lg:w-[700px] h-[350px] lg:h-[320px] bg-white rounded-lg p-4 border border-neutral-300"
        >
          <a
            href="#"
            className="btn-close absolute border-neutral-300 border -top-2 -right-2 text-lg px-2 bg-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setShowCookiesConfig(false);
            }}
          >
            X
          </a>
          <div>
            <h4 className="mb-2">Privacy Overview</h4>
            <div>
              <div className="text-xs lg:text-sm">
                This website uses cookies to improve your experience while you
                navigate through the website. Out of these, the cookies that are
                categorized as necessary are stored on your browser as they are
                essential for the working of basic functionalities of the
                website. We also use third-party cookies that help us analyze
                and understand how you use this website. These cookies will be
                stored in your browser only with your consent. You also have the
                option to opt-out of these cookies. But opting out of some of
                these cookies may affect your browsing experience.
              </div>
              <br />
              <strong>Cookie : Google's Analytics (essential)</strong>
            </div>
            <a
              href="#"
              className="absolute rounded-lg text-white bg-eo_blue-200 p-2 bottom-4 right-4"
              onClick={(e) => {
                e.preventDefault();
                Cookies.set("accept_cookie_consent", "true");
                setShowCookiesConcent(false);
                setShowCookiesConfig(false);
              }}
            >
              Accept
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
