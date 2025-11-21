import { useState, useEffect, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import api from "../service/api";
import Main from "../layout/MainLayout";
import CustomBreadcrumb from "../components/CustomBreadcrumb";

const PageTransition = lazy(() => import("../animations/PageTransition"));
const ErrorPage = lazy(() => import("./ErrorPage"));

type pageSearchResult = {
  id: string;
  title: string;
  summary: string;
  alias: string;
  type: string;
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<pageSearchResult[]>([]);
  const [error, setError] = useState(false);
  const globalCtx = useContext(GlobalContext);
  const [showError, setShowError] = useState<Boolean>(false);
  const [dataRequested, setDataRequested] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unknown error, please try again later"
  );

  const load = async () => {
    /**
     * * Get list of content/products based on the search keywords
     */
    try {
      setError(false);
      setErrorMessage("");
      const limit = "&page[limit]=100";
      let tmpSetSearchResults: pageSearchResult[] = [];
      const filter_page = `?filter[fulltext]=${searchParams.get("keywords")}`;

      //get all the content
      const url_page = `${
        import.meta.env.VITE_API_SEARCH_API
      }${filter_page}${limit}`;
      let response: any = await api.get(url_page);
      if (response.status === 200) {
        setDataRequested(true);
        if (response.data.data.length > 0) {
          response.data.data.forEach((element: any) => {
            let result: pageSearchResult = {
              id: element.id,
              title: element.attributes.title,
              summary:
                element.attributes.body !== null
                  ? element.attributes.body.summary
                  : "",
              alias: element.attributes.path.alias,
              type: element.type,
            };
            tmpSetSearchResults = [...tmpSetSearchResults, result];
          });
          setSearchResults(tmpSetSearchResults);
        }
      }
    } catch (error: any) {
      if (typeof error === "object" && error !== undefined) {
        setShowError(true);
        setErrorMessage(
          "Ups!! there is a problem with the connection, please try again later"
        );
      }
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("product_list") === null)
      globalCtx?.updateProductList(globalCtx?.global.lang);
    setTimeout(() => {
      load();
    }, 1000);
  }, []);
  if (showError)
    return (
      <PageTransition effect="opacity">
        <ErrorPage
          title="500 Error"
          body={errorMessage}
          second_body=""
          third_body=""
          image=""
          alias=""
          metaDescription=""
        />
      </PageTransition>
    );
  return (
    <Main title="" titleClass="">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} |{" "}
          {globalCtx?.global.lang === "fr" ? "" : "Search page"}
        </title>
        <meta name="description" content="" />
      </Helmet>
      <div
        id="search-page"
        className="w-full lg:w-[1200px] m-auto col-span-1 p-2"
      >
        <CustomBreadcrumb />
        {error && (
          <p className="text-red-500 border border-red-500 p-2 bg-red-200 rounded-xl mb-0 text-left">
            {errorMessage}
          </p>
        )}
        <h1 className="text-center py-4 text-eo_orange uppercase">Search</h1>
        <div id="search-results">
          {searchResults.map((element: pageSearchResult, index: number) => (
            <div
              className="search-result border-b-2 border-gray-200 last:border-0 py-6"
              key={index}
            >
              <h3 className="text-2xl text-brinks_blue-300 font-bold mb-4">
                <Link
                  to={`${
                    element.type === "node--page" ||
                    element.type === "node--article"
                      ? element.alias
                      : element.type === "node--job_position"
                      ? "/en/page/careers"
                      : `${element.alias}?id=${element.id}`
                  }`}
                >
                  {element.title}
                </Link>
              </h3>
              <p
                className="text-left leading-6 text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: element.summary }}
              ></p>
              <Link
                to={`${
                  element.type === "node--page" ||
                  element.type === "node--article"
                    ? element.alias
                    : element.type === "node--job_position"
                    ? "/en/page/careers"
                    : `${element.alias}?id=${element.id}`
                }`}
                className="bg-brinks_blue-300 text-white px-2 py-1 bg-eo_orange"
              >
                Read more
              </Link>
            </div>
          ))}
          {searchResults.length === 0 && dataRequested && (
            <p className="py-10">
              There is no result(s) for the search keyword.
            </p>
          )}
        </div>
      </div>
    </Main>
  );
};

export default Search;
