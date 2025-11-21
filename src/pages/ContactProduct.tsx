import { useContext, useRef, useEffect, useState } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import rest from "../service/rest";
import CustomBreadcrumb from "../components/CustomBreadcrumb";
import Main from "../layout/MainLayout";
import PageTransition from "../animations/PageTransition";
import ErrorPage from "./ErrorPage";
import ReCAPTCHA from "react-google-recaptcha";
const ContactUs = () => {
  const globalCtx = useContext(GlobalContext);
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const organizationRef = useRef<HTMLInputElement>(null);
  const productsSolutionsRef = useRef<HTMLSelectElement>(null);
  const buyRentRef = useRef<HTMLSelectElement>(null);
  const anyThingElseRef = useRef<HTMLTextAreaElement>(null);
  const acceptReceiveNewsRef = useRef<HTMLInputElement>(null);
  const productTitleRef = useRef<HTMLInputElement>(null);
  const acceptTermsConditionsRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const title: any = searchParams.get("product_title");
  const [errorFirstName, setErrorFirstName] = useState<Boolean>(false);
  const [errorLastName, setErrorLastName] = useState<Boolean>(false);
  const [errorEmail, setErrorEmail] = useState<Boolean>(false);
  const [errorPhoneNumber, setErrorPhoneNumber] = useState<Boolean>(false);
  const [errorOrganization, setErrorOrganization] = useState<Boolean>(false);
  const [errorProductsSolutions, setErrorProductsSolutions] =
    useState<Boolean>(false);
  const [errorBuyRent, setErrorBuyRent] = useState<Boolean>(false);
  const [errorAnyThingElse, setErrorAnyThingElse] = useState<Boolean>(false);
  const [errorTermsConditions, setErrorTermsConditions] =
    useState<Boolean>(false);
  const [errorSubmission, setErrorSubmission] = useState<Boolean>(false);
  const [successSubmission, setSuccessSubmission] = useState<Boolean>(false);
  const [errorSubmissionMessage, setErrorSubmissionMessage] =
    useState<string>("");
  const [successSubmissionMessage, setSuccessSubmissionMessage] =
    useState<string>("");
  const [alias, setAlias] = useState(
    globalCtx?.global.lang === "Fr" ? "product-contact" : "produit-contact"
  );
  const [showError, setShowError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unknown error, please try again later"
  );
  const handleError = () => {
    let yPos = document.getElementById("contact-form")?.offsetTop;
    window.scrollTo({ top: yPos !== undefined ? yPos : 0, behavior: "smooth" });
    triggerErrorSubmission();
  };
  const triggerErrorSubmission = () => {
    setErrorSubmission(true);
    if (globalCtx?.global.lang === "Fr") {
      setErrorSubmissionMessage("There was an error with the submission");
    } else {
      setErrorSubmissionMessage(
        "Une erreur s'est produite lors de la soumission"
      );
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorOrganization(false);
    setErrorEmail(false);
    setErrorPhoneNumber(false);
    setErrorBuyRent(false);
    setErrorAnyThingElse(false);
    setErrorTermsConditions(false);
    setErrorSubmission(false);
    let first_name = firstNameRef.current?.value;
    if (first_name === "") {
      setErrorFirstName(true);
      handleError();
      return;
    }
    let last_name = lastNameRef.current?.value;
    if (last_name === "") {
      setErrorLastName(true);
      handleError();
      return;
    }
    let organization = organizationRef.current?.value;
    if (organization === "") {
      setErrorOrganization(true);
      handleError();
      return;
    }
    let email = emailRef.current?.value;
    if (email === "") {
      setErrorEmail(true);
      handleError();
      return;
    }
    let phone_number = phoneNumberRef.current?.value;
    if (phone_number === "") {
      setErrorPhoneNumber(true);
      handleError();
      return;
    }
    let products_solutions = productsSolutionsRef.current?.value;
    if (products_solutions === "") {
      setErrorProductsSolutions(true);
      handleError();
      return;
    }
    let buy_rent = buyRentRef.current?.value;
    if (buy_rent === "") {
      setErrorBuyRent(true);
      handleError();
      return;
    }
    let any_thing_else = anyThingElseRef.current?.value;
    if (any_thing_else === "") {
      setErrorAnyThingElse(true);
      handleError();
      return;
    }
    let term_conditions = acceptTermsConditionsRef.current?.checked;
    if (!term_conditions) {
      setErrorTermsConditions(true);
      handleError();
      return;
    }
    let product_title = productTitleRef.current?.value;
    let accept_receive_news = acceptReceiveNewsRef.current?.checked;
    //prepare form data to send to backoffice contact webform
    let url = import.meta.env.VITE_API_WEBFORM;
    let webform_id = import.meta.env.VITE_API_CONTACT_PRODUCT_ID_FORM;
    let formData = new FormData();
    formData.append("webform_id", webform_id!);
    formData.append("first_name", first_name!);
    formData.append("last_name", last_name!);
    formData.append("organization", organization!);
    formData.append("email", email!);
    formData.append("phone_number", phone_number!);
    formData.append("proposal_required_for", products_solutions!);
    formData.append("buy_or_rent", buy_rent!);
    formData.append("anything_else_we_need_to_know", any_thing_else!);
    formData.append("accept_receive_news", accept_receive_news ? "1" : "0");
    formData.append("product_name", product_title!);
    let data = JSON.stringify(Object.fromEntries(formData));
    try {
      let response = await rest.post(`${url}`, data);
      if (response.status === 200) {
        setSuccessSubmission(true);
        if (globalCtx?.global.lang === "Fr") {
          setSuccessSubmissionMessage(
            "Thanks for your information, we will be in contact soon"
          );
        } else {
          setSuccessSubmissionMessage(
            "Merci pour vos informations, nous vous contacterons bientôt"
          );
        }
        formRef.current?.reset();
        let yPos = document.getElementById("contact-form")?.offsetTop;
        window.scrollTo({
          top: yPos !== undefined ? yPos : 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        triggerErrorSubmission();
      }
    }
  };
  useEffect(() => {
    setErrorMessage("Unknown error");
    setShowError(false);
    if (globalCtx?.global.lang === "Fr") setAlias("product-contact");
    else setAlias("produit-contact");
  }, [globalCtx?.global, showError]);
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
    <PageTransition effect="opacity">
      <Helmet>
        <title>
          {import.meta.env.VITE_PROJECT_NAME} |{" "}
          {globalCtx?.global.lang === "Fr"
            ? "Information request"
            : "Demande d'information"}
        </title>
        <meta name="description" content="Information request" />
      </Helmet>
      <Main title="" titleClass="">
        <h1 className="text-center py-4 text-eo_orange capitalize bg-eo_gray_products text-2xl">
          {globalCtx?.global.lang === "Fr"
            ? "Information request"
            : "Demande d'information"}
        </h1>
        <div className="container m-auto pb-12" id="contact-us-page">
          <CustomBreadcrumb />
          <div className="grid lg:grid-cols-2 grid-cols-1"></div>
        </div>
        <div className="bg-gray-200 w-full pt-20 pb-20" id="contact-form">
          <div className="w-full lg:w-[1024px] m-auto py-4 lg:py-10 px-4 lg:px-10 bg-white">
            <p className="border-l-[0.9rem] pl-2 text-xl lg:text-2xl text-black font-normal border-eo_blue-200 mb-10 mt-10">
              {globalCtx?.global.lang === "Fr"
                ? "Information request"
                : "Demande d'information"}
              <br />
              {globalCtx?.global.lang === "Fr"
                ? "for selected product"
                : "pour le produit sélectionné"}
            </p>
            <div className="product-title text-center text-3xl mb-10 text-black">
              {searchParams.get("product_title")}
            </div>
            <form
              action=""
              className="grid grid-cols-1 lg:grid-cols-2"
              id="contact-us-form"
              ref={formRef}
            >
              <div
                id="message"
                className="w-full col-span-2 px-4 lg:px-20 mb-6"
              >
                {errorSubmission ? (
                  <p className="border border-red-500 rounded-md py-2 px-2 text-red-600 bg-red-200">
                    {errorSubmissionMessage}
                  </p>
                ) : null}
                {successSubmission ? (
                  <p className="border border-green-500 rounded-md py-2 px-2 text-green-600 bg-green-200">
                    {successSubmissionMessage}
                  </p>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr" ? "First name" : "Prénom"} *
                </label>
                <input
                  type="text"
                  className={
                    errorFirstName
                      ? "bg-gray-200 p-2 w-full focus:outline-none border border-red-600"
                      : "bg-gray-200 p-2 w-full focus:outline-none"
                  }
                  ref={firstNameRef}
                />
                {errorFirstName ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Last name"
                    : "Nom de famille"}{" "}
                  *
                </label>
                <input
                  type="text"
                  className={
                    errorLastName
                      ? "bg-gray-200 p-2 w-full focus:outline-none border border-red-600"
                      : "bg-gray-200 p-2 w-full focus:outline-none"
                  }
                  ref={lastNameRef}
                />
                {errorLastName ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">E-mail *</label>
                <input
                  type="email"
                  className={
                    errorEmail
                      ? "bg-gray-200 p-2 w-full focus:outline-none border border-red-600"
                      : "bg-gray-200 p-2 w-full focus:outline-none"
                  }
                  ref={emailRef}
                />
                {errorEmail ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Phone number"
                    : "Numéro de téléphone"}{" "}
                  *
                </label>
                <input
                  type="text"
                  className={
                    errorPhoneNumber
                      ? "bg-gray-200 p-2 w-full focus:outline-none border border-red-600"
                      : "bg-gray-200 p-2 w-full focus:outline-none"
                  }
                  ref={phoneNumberRef}
                />
                {errorPhoneNumber ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Organization"
                    : "Organisme"}{" "}
                  *
                </label>
                <input
                  type="text"
                  className={
                    errorOrganization
                      ? "bg-gray-200 p-2 w-full focus:outline-none border border-red-600"
                      : "bg-gray-200 p-2 w-full focus:outline-none"
                  }
                  ref={organizationRef}
                />
                {errorOrganization ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Products / Solutions"
                    : "Produits / Solutions"}{" "}
                  *
                </label>
                <select
                  className={
                    errorProductsSolutions
                      ? "border border-red-600 w-full bg-gray-200 p-2"
                      : " w-full bg-gray-200 p-2"
                  }
                  ref={productsSolutionsRef}
                >
                  <option value="printing">{`Printing`}</option>
                  <option value="mailing">{`Mailing`}</option>
                  <option value="cash-handling">{`Cash Handling`}</option>
                  <option value="office-equipment">{`Office equipment`}</option>
                  <option value="imaging-graphic-communication">{`Imaging & Graphic communication`}</option>
                  <option value="supplies-service">{`Supplies & Service`}</option>
                  <option value="others">{`Others`}</option>
                </select>
                {errorProductsSolutions ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2 lg:col-span-1">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Are you looking to buy or rent?"
                    : "Est-ce que vous cherchez à acheter ou louer?"}{" "}
                  *
                </label>
                <select
                  className={
                    errorBuyRent
                      ? "border border-red-600 w-full bg-gray-200 p-2"
                      : " w-full bg-gray-200 p-2"
                  }
                  ref={buyRentRef}
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
                {errorBuyRent ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2">
                <label className="w-full mb-2 block">
                  {globalCtx?.global.lang === "Fr"
                    ? "Tell us about your requirement"
                    : "Parlez-nous de votre besoin"}{" "}
                  *
                </label>
                <textarea
                  name=""
                  id=""
                  cols={30}
                  rows={10}
                  className={
                    errorAnyThingElse
                      ? "w-full bg-gray-200 p-2 focus:outline-none border border-red-600"
                      : "w-full bg-gray-200 p-2 focus:outline-none"
                  }
                  ref={anyThingElseRef}
                ></textarea>
                {errorAnyThingElse ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="field-container mb-5 px-4 lg:px-20 col-span-2">
                <div className="flex flex-wrap">
                  <input
                    type="checkbox"
                    className="checkbox mt-1 mr-2"
                    ref={acceptReceiveNewsRef}
                  />
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {globalCtx?.global.lang === "Fr"
                        ? "I accept to receive the latest news and offers from Harel Mallac & Co. and its subsidiaries."
                        : "J'accepte de recevoir les dernières actualités et offres de Harel Mallac & Cie et ses filiales."}
                    </span>
                  </label>
                </div>
                <div className="flex flex-wrap">
                  <input
                    type="checkbox"
                    className={
                      errorTermsConditions
                        ? "checkbox mt-1 mr-2 border border-red-600"
                        : "checkbox mt-1 mr-2"
                    }
                    ref={acceptTermsConditionsRef}
                  />
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {globalCtx?.global.lang === "Fr"
                        ? "By submitting your data you are agreeing to our"
                        : "En soumettant vos données, vous acceptez notre"}{" "}
                      <Link className="underline" to="/page/privacy-policy">
                        {globalCtx?.global.lang === "Fr"
                          ? "Privacy & Cookie Policies"
                          : "Politiques de confidentialité et de cookies"}
                      </Link>{" "}
                      and{" "}
                      <Link className="underline" to="/term-conditions">
                        {globalCtx?.global.lang === "Fr"
                          ? "Terms & Conditions"
                          : "Termes et Conditions"}
                      </Link>
                    </span>
                  </label>
                </div>
                {errorTermsConditions ? (
                  <small className="error">
                    {globalCtx?.global.lang === "Fr"
                      ? "This field is required"
                      : "Ce champ est requis"}
                  </small>
                ) : null}
              </div>
              <div className="hidden">
                <input type="text" value={title} ref={productTitleRef}></input>
              </div>
              <div id="recaptcha" className="col-span-2 px-4 lg:px-20 mb-10">
                {/* <ReCAPTCHA
                sitekey={import.meta.env.VITE_GOOGLE_CAPTCHA_SITE_KEY}
              /> */}
              </div>
              <div id="actions" className="px-4 lg:px-20 col-span-2">
                <button
                  className="px-10 py-2 bg-eo_blue-200 text-white flex flex-wrap w-[200px] justify-between leading-8"
                  onClick={(e) => handleSubmit(e)}
                >
                  <span className="btn-text">
                    {globalCtx?.global.lang === "Fr" ? "Submit" : "Soumettre"}
                  </span>
                  <span className="text-2xl btn-arrow">
                    <div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Main>
    </PageTransition>
  );
};

export default ContactUs;
