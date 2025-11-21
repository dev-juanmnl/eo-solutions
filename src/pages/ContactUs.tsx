import { useContext, useRef, useEffect, useState, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import rest from "../service/rest";
import api from "../service/api";
import api_fr from "../service/api_fr";
import mail_logo from "../assets/images/mail-orange.svg";
import wall_clock from "../assets/images/wall-clock-orange.svg";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
import MapEmbed from "../blocks/MapEmbed";
import texts from "../texts.json";

const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const Main = lazy(() => import("../layout/MainLayout"));
const PageTransition = lazy(() => import("../animations/PageTransition"));
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
const ErrorPage = lazy(() => import("./ErrorPage"));
const BlockTransition = lazy(() => import("../animations/BlockTransition"));
//import ReCAPTCHA from "react-google-recaptcha";
const ContactUs = () => {
	const globalCtx = useContext(GlobalContext);
	const formRef = useRef<HTMLFormElement>(null);
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const industryRef = useRef<HTMLSelectElement>(null);
	const industryOtherRef = useRef<HTMLInputElement>(null);
	const organizationRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);
	const proposalRequiredRef = useRef<HTMLSelectElement>(null);
	const buyRentRef = useRef<HTMLSelectElement>(null);
	const anyThingElseRef = useRef<HTMLTextAreaElement>(null);
	const acceptReceiveNewsRef = useRef<HTMLInputElement>(null);
	const acceptTermsConditionsRef = useRef<HTMLInputElement>(null);
	const [showOtherIndustryName, setShowOtherIndustryName] =
		useState<boolean>(false);
	const [errorFirstName, setErrorFirstName] = useState<Boolean>(false);
	const [errorLastName, setErrorLastName] = useState<Boolean>(false);
	const [errorIndustry, setErrorIndustry] = useState<Boolean>(false);
	const [errorOtherIndustry, setErrorOtherIndustry] = useState<Boolean>(false);
	const [errorOrganization, setErrorOrganization] = useState<Boolean>(false);
	const [errorEmail, setErrorEmail] = useState<Boolean>(false);
	const [errorPhoneNumber, setErrorPhoneNumber] = useState<Boolean>(false);
	const [errorProposalRequired, setErrorProposalRequired] =
		useState<Boolean>(false);
	const [errorBuyRent, setErrorBuyRent] = useState<Boolean>(false);
	const [errorTermsConditions, setErrorTermsConditions] =
		useState<Boolean>(false);
	const [errorSubmission, setErrorSubmission] = useState<Boolean>(false);
	const [successSubmission, setSuccessSubmission] = useState<Boolean>(false);
	const [errorSubmissionMessage, setErrorSubmissionMessage] =
		useState<string>("");
	const [successSubmissionMessage, setSuccessSubmissionMessage] =
		useState<string>("");
	const [alias, setAlias] = useState(
		globalCtx?.global.lang === "Fr" ? "contact-us" : "nous-contacter"
	);
	const [showError, setShowError] = useState<Boolean>(false);
	const [contactBlock1, setContactBlock1] = useState("");
	const [contactBlock2, setContactBlock2] = useState("");
	const [errorMessage, setErrorMessage] = useState(
		"Unknown error, please try again later"
	);
	const [submittedSuccessfully, setSubmittedSuccessfully] =
		useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

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

	const triggerError = () => {
		setErrorSubmission(true);
		if (globalCtx?.global.lang === "Fr") {
			setErrorSubmissionMessage("There was an error with the submission");
		} else {
			setErrorSubmissionMessage(
				"Une erreur s'est produite lors de la soumission"
			);
		}
	};
	const handleError = () => {
		let yPos = document.getElementById("contact-form")?.offsetTop;
		window.scrollTo({ top: yPos !== undefined ? yPos : 0, behavior: "smooth" });
		triggerError();
	};
	const resetStates = () => {
		setErrorFirstName(false);
		setErrorLastName(false);
		setErrorIndustry(false);
		setErrorOtherIndustry(false);
		setErrorOrganization(false);
		setErrorEmail(false);
		setErrorPhoneNumber(false);
		setErrorProposalRequired(false);
		setErrorBuyRent(false);
		setErrorTermsConditions(false);
		setErrorSubmission(false);
		setSuccessSubmission(false);
		setSubmittedSuccessfully(false);
		setLoading(false);
	};
	const handleSubmit = async (e: any) => {
		resetStates();
		e.preventDefault();
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
		let industry = industryRef.current?.value;
		if (industry === "") {
			setErrorIndustry(true);
			handleError();
			return;
		}
		let other_industry = "";
		if (industry === "other") {
			other_industry = industryOtherRef.current?.value!;
			if (other_industry === "") {
				setErrorOtherIndustry(true);
				handleError();
				return;
			}
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
		let proposal_required = proposalRequiredRef.current?.value;
		if (proposal_required === "") {
			setErrorProposalRequired(true);
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
		let term_conditions = acceptTermsConditionsRef.current?.checked;
		if (!term_conditions) {
			setErrorTermsConditions(true);
			handleError();
			return;
		}
		let accept_receive_news = acceptReceiveNewsRef.current?.checked;
		setLoading(true);
		//prepare form data to send to backoffice contact webform
		let url = import.meta.env.VITE_API_WEBFORM;
		let webform_id = import.meta.env.VITE_API_CONTACT_ID_FORM;
		let formData = new FormData();
		formData.append("webform_id", webform_id!);
		formData.append("first_name", first_name!);
		formData.append("last_name", last_name!);
		formData.append("email", email!);
		formData.append("phone_number", phone_number!);
		formData.append("industry", industry!);
		formData.append("other_industry", other_industry!);
		formData.append("organization", organization!);
		formData.append("proposal_required_for", proposal_required!);
		formData.append("buy_or_rent", buy_rent!);
		formData.append("anything_else_we_need_to_know", any_thing_else!);
		formData.append("accept_receive_news", accept_receive_news ? "1" : "0");
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
				setSubmittedSuccessfully(true);
				setShowOtherIndustryName(false);
				let yPos = document.getElementById("contact-form")?.offsetTop;
				window.scrollTo({
					top: yPos !== undefined ? yPos : 0,
					behavior: "smooth",
				});
			}
		} catch (error) {
			if (typeof error === "object" && error !== null) {
				triggerError();
			}
		}
	};
	const load = () => {
		let block_url = import.meta.env.VITE_API_BLOCKS;
		let contact_block_1 = import.meta.env.VITE_API_BLOCK_CONTACT_1;
		let contact_block_2 = import.meta.env.VITE_API_BLOCK_CONTACT_2;
		if (globalCtx?.global.lang === "En") {
			contact_block_1 = import.meta.env.VITE_API_BLOCK_CONTACT_1_FR;
			contact_block_2 = import.meta.env.VITE_API_BLOCK_CONTACT_2_FR;
		}
		//--------- Block contact one ---------
		getBlockInformation(
			block_url,
			contact_block_1,
			"contact_block_1",
			globalCtx?.global.lang!
		);
		//--------- Block contact two ---------
		getBlockInformation(
			block_url,
			contact_block_2,
			"contact_block_2",
			globalCtx?.global.lang!
		);
	};
	const getBlockInformation = async (
		block_url: string,
		block_id: string,
		block_name: string,
		lang: string
	) => {
		let response: any = null;
		let content: any = null;
		if (lang === "Fr") response = await api.get(`${block_url}/${block_id}`);
		else response = await api_fr.get(`${block_url}/${block_id}`);
		content = response?.data.data.attributes.dependencies.content[0];
		content = content?.replaceAll(":", "/");
		if (lang === "Fr") response = await api.get(`/${content}`);
		else response = await api_fr.get(`/${content}`);

		if (block_name === "contact_block_1")
			setContactBlock1(response?.data.data.attributes.body.value);
		if (block_name === "contact_block_2")
			setContactBlock2(response?.data.data.attributes.body.value);
	};
	useEffect(() => {
		setErrorMessage("Unknown error");
		setShowError(false);
		load();
		if (globalCtx?.global.lang === "Fr") setAlias("contact-us");
		else setAlias("nous-contacter");
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
					{globalCtx?.global.lang === "Fr" ? "Contact us" : "Contactez-nous"}
				</title>
				<meta
					name="title"
					content={`${import.meta.env.VITE_PROJECT_NAME} | ${
						globalCtx?.global.lang === "Fr" ? "Contact us" : "Contactez-nous"
					}`}
				/>
				<meta name="description" content={texts.contact.seo.description} />
			</Helmet>
			<Main title="" titleClass="">
				<div className="container m-auto pb-12" id="contact-us-page">
					<MapEmbed />
					<CustomBreadcrumb />
					<br />
					<br />
					<div
						className="px-4 pt-20 pb-0 lg:px-36 text-sm mb-6 overflow-hidden relative"
						id="title-transition-1"
					>
						<span className="logo absolute top-8">
							<img
								className="float-right mr-6 -mt-2"
								src={title_orange_logo}
								alt="orange-line"
							/>
						</span>
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
								classTitle={"two-lines"}
							>
								<h1 className="uppercase font-light ml-0 mb-12 subtitle">
									{globalCtx?.global.lang === "Fr"
										? "Contact EO Solutions"
										: "Contacter EO Solutions"}
								</h1>
							</TitleTransition>
						</motion.div>
					</div>
					<div className="grid lg:grid-cols-2 grid-cols-1">
						<BlockTransition classes="contact-address address-1 text-white bg-eo_gray_sticky shadow-box col-span-1 py-14 px-12 font-bold lg:mr-8 mb-8 lg:mb-0">
							<div
								className="text-white"
								dangerouslySetInnerHTML={{ __html: contactBlock1 }}
							/>
						</BlockTransition>
						<BlockTransition classes="contact-address address-2 text-white bg-eo_gray_sticky shadow-box col-span-1 py-14 px-12 font-bold">
							<div
								className="text-white"
								dangerouslySetInnerHTML={{ __html: contactBlock2 }}
							/>
						</BlockTransition>
					</div>
				</div>
				<div className="bg-gray-200 w-full pt-20 pb-20" id="contact-form">
					<div className="w-full lg:w-[1024px] m-auto py-4 lg:py-10 px-4 lg:px-10 bg-white">
						<p className="border-l-[0.9rem] pl-2 text-xl lg:text-2xl text-black font-normal border-eo_blue-200 mb-10 mt-10">
							{globalCtx?.global.lang === "Fr"
								? "Do you have any queries or questions?"
								: "Avez-vous des questions ou des questions?"}
							<br />
							{globalCtx?.global.lang === "Fr"
								? "Send us an e-mail and we will reply to you as soon as possible."
								: "Envoyez-nous un e-mail et nous vous répondrons dans les plus brefs délais."}
						</p>
						<ul className="flex flex-wrap justify-between mb-10">
							<li className="w-full lg:w-[45%] py-4 flex flex-wrap">
								<img
									className="w-[25px] mr-2"
									src={wall_clock}
									alt="clock-icon"
								/>
								{globalCtx?.global.lang === "Fr"
									? "Monday to Friday, from 8:15 a.m. to 4:45 p.m."
									: "Du lundi au vendredi, de 8 h à 17 h"}
							</li>
							<li className="w-full lg:w-[45%] py-4 flex flex-wrap">
								<img
									className="w-[25px] mr-2"
									src={mail_logo}
									alt="mail-logo"
								/>
								<a href="mailto:info@eosolutions.co">info@eosolutions.co</a>
							</li>
						</ul>
						{!submittedSuccessfully ? (
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
										{globalCtx?.global.lang === "Fr" ? "First name" : "Prénom"}{" "}
										*
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
										{globalCtx?.global.lang === "Fr" ? "Industry" : "Industrie"}{" "}
										*
									</label>
									<select
										className={
											errorIndustry
												? "border border-red-600 w-full bg-gray-200 p-2"
												: " w-full bg-gray-200 p-2"
										}
										ref={industryRef}
										onChange={(e) => {
											e.preventDefault();
											if (e.target.value === "other") {
												setShowOtherIndustryName(true);
											} else {
												setShowOtherIndustryName(false);
											}
										}}
									>
										<option value="banking-financial">{`Banking & Financial Services`}</option>
										<option value="property-dev-construction">{`Property Development & Construction`}</option>
										<option value="hospitality-restauration">{`Hospitality & Restauration`}</option>
										<option value="agriculture">{`Agriculture`}</option>
										<option value="manufacturing">{`Manufacturing`}</option>
										<option value="food-industry">{`Food Industry`}</option>
										<option value="retail-warehousing">{`Retail & Warehousing`}</option>
										<option value="textile">{`Textile`}</option>
										<option value="printing">{`Printing`}</option>
										<option value="other">{`Other`}</option>
									</select>
									{errorIndustry ? (
										<small className="error">
											{globalCtx?.global.lang === "Fr"
												? "This field is required"
												: "Ce champ est requis"}
										</small>
									) : null}
									{showOtherIndustryName && (
										<div>
											<input
												type="text"
												name="other-industry-name"
												className={`bg-gray-200 p-2 w-full focus:outline-none mt-2 ${
													errorOtherIndustry ? "border border-red-600" : ""
												}`}
												ref={industryOtherRef}
											/>
											{errorOtherIndustry ? (
												<small className="error">
													{globalCtx?.global.lang === "Fr"
														? "This field is required"
														: "Ce champ est requis"}
												</small>
											) : null}
										</div>
									)}
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
											errorProposalRequired
												? "border border-red-600 w-full bg-gray-200 p-2"
												: " w-full bg-gray-200 p-2"
										}
										ref={proposalRequiredRef}
									>
										<option value="printing">{`Printing`}</option>
										<option value="mailing">{`Mailing`}</option>
										<option value="cash-handling">{`Cash Handling`}</option>
										<option value="office-equipment">{`Office equipment`}</option>
										<option value="imaging-graphic-communication">{`Imaging & Graphic communication`}</option>
										<option value="supplies-service">{`Supplies & Service`}</option>
										<option value="others">{`Others`}</option>
									</select>
									{errorProposalRequired ? (
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
											? "Anything else we need to know?"
											: "Autre chose que nous devons savoir?"}
									</label>
									<textarea
										name=""
										id=""
										cols={30}
										rows={10}
										className="w-full bg-gray-200 p-2 focus:outline-none"
										ref={anyThingElseRef}
									></textarea>
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
												<Link
													className="underline"
													to="/en/page/privacy-policy"
												>
													{globalCtx?.global.lang === "Fr"
														? "Privacy & Cookie Policies"
														: "Politiques de confidentialité et de cookies"}
												</Link>{" "}
												and{" "}
												<Link
													className="underline"
													to="/en/page/terms-conditions"
												>
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
								<div id="recaptcha" className="col-span-2 px-4 lg:px-20 mb-10">
									{/* <ReCAPTCHA
                sitekey={import.meta.env.VITE_GOOGLE_CAPTCHA_SITE_KEY}
              /> */}
								</div>
								<div id="actions" className="px-4 lg:px-20 col-span-2">
									{loading ? (
										<button
											className="px-10 py-2 bg-neutral-400 text-white flex flex-wrap w-[180px] justify-between leading-8"
											disabled={true}
										>
											<span className="btn-text">Sending ...</span>
										</button>
									) : (
										<button
											className="px-10 py-2 bg-eo_blue-200 text-white flex flex-wrap w-[180px] justify-between leading-8"
											onClick={(e) => handleSubmit(e)}
										>
											<span className="btn-text">
												{globalCtx?.global.lang === "Fr"
													? "Submit"
													: "Soumettre"}
											</span>
											<span className="text-2xl btn-arrow">
												<div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
											</span>
										</button>
									)}
								</div>
							</form>
						) : (
							<div id="submitted-form-message">
								<p>
									Thank you for your interest, which has been allocated to a
									member of our Customer Service Team. Kindly be informed that
									we shall revert accordingly.
								</p>
								<p>
									In the interim, should you have any urgent request, our
									Customer Service Team will gladly assist you on Tel No 230
									2073200 We thank you for your trust in our Solutions.
								</p>
							</div>
						)}
					</div>
				</div>
			</Main>
		</PageTransition>
	);
};

export default ContactUs;
