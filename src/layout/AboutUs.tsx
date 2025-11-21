import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/Global";
import { isMobile } from "react-device-detect";
import { PageInfoType } from "../types/PageInfoType";
import { Helmet } from "react-helmet";
import { BrowserView, MobileView } from "react-device-detect";
import { motion, Variants } from "framer-motion";
import api from "../service/api";
import api_fr from "../service/api_fr";
import Main from "./MainLayout";
import CustomBreadcrumb from "../components/CustomBreadcrumb";
import HeroImage from "../blocks/HeroImage";
import OurPartnersCarousel from "../blocks/OurPartnersCarousel";
import ButtonTransitionWithLink from "../animations/ButtonTransitionWithLink";
import BlockTransition from "../animations/BlockTransition";
import BlockBlueTransition from "../animations/BlockBlueTransition";
import TitleTransition from "../animations/TitleTransition";
import logo from "@/assets/images/logo.svg";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
const AboutUs: React.FunctionComponent<PageInfoType> = (
	props: PageInfoType
) => {
	const globalCtx = useContext(GlobalContext);
	const [blockPlanet, setBlockPlanet] = useState(null);
	const [blockOurCustomers, setBlockOurCustomers] = useState(null);
	const [blockOurPeople, setBlockOurPeople] = useState(null);
	const [blockOurPerformance, setBlockOurPerformance] = useState(null);
	const [blockAboutUsCintillo, setBlockAboutUsCintillo] = useState(null);
	const [blockOurVision, setBlockOurVision] = useState(null);
	const [blockOurMision, setBlockOurMision] = useState(null);
	const [blockBlueLeftOne, setBlockBlueLeftOne] = useState(null);
	const [blockBlueLeftTwo, setBlockBlueLeftTwo] = useState(null);
	const load = async () => {
		try {
			let block_url = import.meta.env.VITE_API_BLOCKS;
			let block_planet_id = import.meta.env.VITE_API_BLOCK_THE_PLANET;
			let block_customers_id = import.meta.env.VITE_API_BLOCK_OUR_CUSTOMERS;
			let block_people_id = import.meta.env.VITE_API_BLOCK_OUR_PEOPLE;
			let block_performance_id = import.meta.env.VITE_API_BLOCK_OUR_PERFORMANCE;
			let block_cintillo_id = import.meta.env.VITE_API_BLOCK_ABOUT_US_CINTILLO;
			let block_our_vision_id = import.meta.env.VITE_API_BLOCK_OUR_VISION;
			let block_our_mision_id = import.meta.env.VITE_API_BLOCK_OUR_MISION;
			let block_blue_left_one_id = import.meta.env
				.VITE_API_BLOCK_ABOUT_US_BLUE_LEFT_ONE;
			let block_blue_left_two_id = import.meta.env
				.VITE_API_BLOCK_ABOUT_US_BLUE_LEFT_TWO;
			if (globalCtx?.global.lang === "En") {
				block_planet_id = import.meta.env.VITE_API_BLOCK_THE_PLANET_FR;
				block_customers_id = import.meta.env.VITE_API_BLOCK_OUR_CUSTOMERS_FR;
				block_people_id = import.meta.env.VITE_API_BLOCK_OUR_PEOPLE_FR;
				block_performance_id = import.meta.env
					.VITE_API_BLOCK_OUR_PERFORMANCE_FR;
				block_cintillo_id = import.meta.env.VITE_API_BLOCK_ABOUT_US_CINTILLO_FR;
				block_our_vision_id = import.meta.env.VITE_API_BLOCK_OUR_VISION_FR;
				block_our_mision_id = import.meta.env.VITE_API_BLOCK_OUR_MISION_FR;
				block_blue_left_one_id = import.meta.env
					.VITE_API_BLOCK_ABOUT_US_BLUE_LEFT_ONE_FR;
				block_blue_left_two_id = import.meta.env
					.VITE_API_BLOCK_ABOUT_US_BLUE_LEFT_TWO_FR;
			}
			//------- planet block -------
			getBlockInformation(
				block_url,
				block_planet_id,
				"planet",
				globalCtx?.global.lang!
			);
			//------- our customers block -------
			getBlockInformation(
				block_url,
				block_customers_id,
				"our_customers",
				globalCtx?.global.lang!
			);
			//------- our people block -------
			getBlockInformation(
				block_url,
				block_people_id,
				"our_people",
				globalCtx?.global.lang!
			);
			//------- our performance block -------
			getBlockInformation(
				block_url,
				block_performance_id,
				"our_performance",
				globalCtx?.global.lang!
			);
			//------- green cintillo block -------
			getBlockInformation(
				block_url,
				block_cintillo_id,
				"cintillo",
				globalCtx?.global.lang!
			);
			//------- our vision block -------
			getBlockInformation(
				block_url,
				block_our_vision_id,
				"our_vision",
				globalCtx?.global.lang!
			);
			//------- our mision block -------
			getBlockInformation(
				block_url,
				block_our_mision_id,
				"our_mision",
				globalCtx?.global.lang!
			);
			//------- blue left block 1 -------
			getBlockInformation(
				block_url,
				block_blue_left_one_id,
				"blue_left_one",
				globalCtx?.global.lang!
			);
			//------- blue left block 2 -------
			getBlockInformation(
				block_url,
				block_blue_left_two_id,
				"blue_left_two",
				globalCtx?.global.lang!
			);
		} catch (error) {
			if (typeof error === "object" && error !== null) {
				console.error(error);
			}
		}
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
		content = response.data.data.attributes.dependencies.content[0];
		content = content.replaceAll(":", "/");
		if (lang === "Fr") response = await api.get(`/${content}`);
		else response = await api_fr.get(`/${content}`);

		if (block_name === "planet")
			setBlockPlanet(response.data.data.attributes.body.value);
		if (block_name === "our_customers")
			setBlockOurCustomers(response.data.data.attributes.body.value);
		if (block_name === "our_people")
			setBlockOurPeople(response.data.data.attributes.body.value);
		if (block_name === "our_performance")
			setBlockOurPerformance(response.data.data.attributes.body.value);
		if (block_name === "cintillo")
			setBlockAboutUsCintillo(response.data.data.attributes.body.value);
		if (block_name === "our_vision")
			setBlockOurVision(response.data.data.attributes.body.value);
		if (block_name === "our_mision")
			setBlockOurMision(response.data.data.attributes.body.value);
		if (block_name === "blue_left_one")
			setBlockBlueLeftOne(response.data.data.attributes.body.value);
		if (block_name === "blue_left_two")
			setBlockBlueLeftTwo(response.data.data.attributes.body.value);
	};
	useEffect(() => {
		load();
	}, [globalCtx?.global]);
	const titleVariants: Variants = {
		offscreen: {
			y: 300,
		},
		onscreen: {
			y: 50,
			transition: {
				type: "spring",
				bounce: 0.5,
				duration: 1.2,
			},
		},
	};
	const blockVariants: Variants = {
		offscreen: {
			y: 300,
		},
		onscreen: {
			y: 0,
			transition: {
				type: "spring",
				bounce: 0.5,
				duration: 1.2,
			},
		},
	};
	return (
		<Main title="" titleClass="">
			<Helmet>
				<title>
					{import.meta.env.VITE_PROJECT_NAME} | {props.title}
				</title>
				<meta name="description" content={props.metaDescription} />
			</Helmet>
			<HeroImage url={props.image} />
			<div className="about-us-page page-content container m-auto relative">
				<CustomBreadcrumb />
				<BlockBlueTransition>
					<div
						className="blue-block"
						dangerouslySetInnerHTML={{ __html: blockBlueLeftOne! }}
					/>
				</BlockBlueTransition>
				<div
					id="title-transition-1"
					className="px-10 pt-36 pb-20 lg:px-16 xl:px-36 text-sm mb-6 overflow-hidden relative"
				>
					<span className="logo absolute top-19">
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
							logo_top={isMobile ? 0 : 30}
							classTitle={"two-lines"}
						>
							<div dangerouslySetInnerHTML={{ __html: props.body }} />
						</TitleTransition>
					</motion.div>
				</div>
				<BlockBlueTransition>
					<div
						className="blue-block"
						dangerouslySetInnerHTML={{ __html: blockBlueLeftTwo! }}
					/>
				</BlockBlueTransition>
				<div className="mision-vision grid grid-cols-1 lg:grid-cols-2 mt-48 px-4 sm:px-0">
					<BlockTransition
						classes={"shadow-box px-8 py-8 lg:mr-10 mr-0 mb-6 lg:mb-0"}
					>
						<div dangerouslySetInnerHTML={{ __html: blockOurVision! }} />
					</BlockTransition>
					<BlockTransition classes={"shadow-box px-8 py-8 lg:mr-10 mr-0"}>
						<div dangerouslySetInnerHTML={{ __html: blockOurMision! }} />
					</BlockTransition>
				</div>
				<div className="px-10 lg:mx-16 xl:mx-36 mt-0 lg:mt-28">
					<motion.div initial="offscreen" whileInView="onscreen">
						<motion.div
							variants={titleVariants}
							dangerouslySetInnerHTML={{ __html: props.second_body }}
						/>
					</motion.div>
				</div>
			</div>
			<div id="cintillo" className="bg-eo_gray_sticky py-16 mt-20 pl-2 lg:pl-0">
				<div dangerouslySetInnerHTML={{ __html: blockAboutUsCintillo! }} />
			</div>
			<div
				className="container m-auto pt-20 px-4 lg:px-2 overflow-hidden"
				id="second-body"
			>
				<BrowserView>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="col-span-2 grid gap-4">
							<div>
								<motion.div
									id="our-people"
									className="w-full h-auto relative lg:pr-40"
									initial={{ left: -650 }}
									whileInView={{ left: 0, transition: { duration: 1 } }}
								>
									<div dangerouslySetInnerHTML={{ __html: blockOurPeople! }} />
									<ButtonTransitionWithLink
										text={
											globalCtx?.global.lang === "Fr" ? "Career" : "Carrière"
										}
										url="/en/page/careers"
									/>
								</motion.div>
							</div>
							<div>
								<motion.div
									id="our-customers"
									className="w-full relative lg:pl-24 lg:pt-6"
									initial={{ left: -650 }}
									whileInView={{ left: 0, transition: { duration: 1 } }}
								>
									<div
										dangerouslySetInnerHTML={{ __html: blockOurCustomers! }}
									/>
								</motion.div>
							</div>
						</div>
						<div className="col-span-2 grid gap-4">
							<div>
								<motion.div
									id="our-performance"
									className="w-full relative lg:pl-16"
									initial={{ right: -650 }}
									whileInView={{ right: 0, transition: { duration: 1 } }}
								>
									<div
										dangerouslySetInnerHTML={{ __html: blockOurPerformance! }}
									/>
									<ButtonTransitionWithLink
										text={
											globalCtx?.global.lang === "Fr"
												? "Our products"
												: "Nos produits"
										}
										url="/en/page/our-solutions"
									/>
								</motion.div>
							</div>
							<div>
								<motion.div
									id="the-planet"
									className="w-full relative pl-40"
									initial={{ right: -650 }}
									whileInView={{ right: 0, transition: { duration: 1 } }}
								>
									<div dangerouslySetInnerHTML={{ __html: blockPlanet! }} />
									<ButtonTransitionWithLink
										text={
											globalCtx?.global.lang === "Fr"
												? "Sustainability"
												: "Durabilité"
										}
										url="/en/page/sustainability"
									/>
								</motion.div>
							</div>
							<div></div>
							<div></div>
						</div>
					</div>
				</BrowserView>
				<MobileView>
					<div className="grid grid-cols-1 lg:grid-cols-4 relative">
						<motion.div
							id="our-people"
							className="col-span-2 px-4 pt-6 pb-4 lg:pr-16 w-full relative overflow-hidden"
							initial="offscreen"
							whileInView="onscreen"
						>
							<motion.div variants={blockVariants}>
								<div dangerouslySetInnerHTML={{ __html: blockOurPeople! }} />
								<ButtonTransitionWithLink
									text={globalCtx?.global.lang === "Fr" ? "Career" : "Carrière"}
									url="/en/page/carriers"
								/>
							</motion.div>
						</motion.div>
						<motion.div
							id="our-performance"
							className="col-span-2 p-4 lg:pt-16 w-full relative overflow-hidden"
							initial="offscreen"
							whileInView="onscreen"
						>
							<motion.div variants={blockVariants}>
								<div
									dangerouslySetInnerHTML={{ __html: blockOurPerformance! }}
								/>
								<ButtonTransitionWithLink
									text={
										globalCtx?.global.lang === "Fr"
											? "Our products"
											: "Nos produits"
									}
									url="/en/page/our-solutions"
								/>
							</motion.div>
						</motion.div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-4 lg:mt-20 mt-10 relative">
						<motion.div
							id="our-customers"
							className="col-span-2 pl-2 pb-4 lg:pl-14 w-full relative overflow-hidden"
							initial="offscreen"
							whileInView="onscreen"
						>
							<motion.div variants={blockVariants}>
								<div dangerouslySetInnerHTML={{ __html: blockOurCustomers! }} />
							</motion.div>
						</motion.div>
						<motion.div
							id="the-planet"
							className="col-span-2 pl-2 lg:pl-20 pt-10 lg:pt-40 w-full relative"
							initial="offscreen"
							whileInView="onscreen"
						>
							<motion.div variants={blockVariants}>
								<div dangerouslySetInnerHTML={{ __html: blockPlanet! }} />
								<ButtonTransitionWithLink
									text={
										globalCtx?.global.lang === "Fr"
											? "Sustainability"
											: "Durabilité"
									}
									url="/en/page/sustainability"
								/>
							</motion.div>
						</motion.div>
					</div>
				</MobileView>
				<div id="our-partners-carousel" className="mt-20">
					<h3
						className="uppercase mb-4 lg:mb-20 w-[200px] text-2xl"
						id="our-partners-caruosel-title"
					>
						{globalCtx?.global.lang === "Fr"
							? "Our Partners"
							: "Nos partenaires"}
					</h3>
					<OurPartnersCarousel />
				</div>
			</div>
		</Main>
	);
};

export default AboutUs;
