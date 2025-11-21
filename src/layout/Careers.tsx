import { useEffect, useState, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
import api from "../service/api";
import api_fr from "../service/api_fr";
const Main = lazy(() => import("./MainLayout"));
const HeroImage = lazy(() => import("../blocks/HeroImage"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const JobApplication = lazy(() => import("../blocks/JobApplication"));
const BlockBlueTransition = lazy(
	() => import("../animations/BlockBlueTransition")
);
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
import Vacancies from "../components/Vacancies";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";

const Careers: React.FunctionComponent<PageInfoType> = (
	props: PageInfoType
) => {
	const globalCtx = useContext(GlobalContext);
	const [blockBlueLeft, setBlockBlueLeft] = useState("");
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
	const load = async () => {
		try {
			let block_url = import.meta.env.VITE_API_BLOCKS;
			let block_blue_left = import.meta.env.VITE_API_BLOCK_CAREER_BLUE_LEFT_ONE;
			//------- get careers left blue block -----
			getBlockInformation(
				block_url,
				block_blue_left,
				"blue_left",
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

		if (block_name === "blue_left")
			setBlockBlueLeft(response.data.data.attributes.body.value);
	};
	useEffect(() => {
		load();
	}, [globalCtx?.global]);
	return (
		<Main title="" titleClass="">
			<Helmet>
				<title>
					{import.meta.env.VITE_PROJECT_NAME} | {props.title}
				</title>
				<meta name="description" content={props.metaDescription} />
			</Helmet>
			<HeroImage url={props.image} />
			<section id="hero" className="container m-auto">
				<CustomBreadcrumb />
			</section>
			<div className="careers-page page-content container m-auto relative overflow-hidden">
				<div
					className="px-4 pt-20 pb-20 lg:px-36 text-sm mb-6 overflow-hidden relative"
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
							<div dangerouslySetInnerHTML={{ __html: props.body }} />
						</TitleTransition>
					</motion.div>
				</div>
				<BlockBlueTransition>
					<div
						className="blue-block"
						dangerouslySetInnerHTML={{ __html: blockBlueLeft }}
					/>
				</BlockBlueTransition>
				{/* Vacancies */}
				{import.meta.env.VITE_API_VACANCIES_ENABLED === "true" && (
					<Vacancies lang={globalCtx?.global.lang!} />
				)}
				<p
					className="text-eo_blue-200 font-light text-sm text-center mt-2 lg:mt-5"
					id="privacy-notice"
				>
					{globalCtx?.global.lang === "Fr"
						? "Please consult our"
						: "Veuillez consulter notre"}{" "}
					<Link className="underline" to="/en/page/privacy-policy">
						{globalCtx?.global.lang === "Fr"
							? "Privacy Notice"
							: "Avis de confidentialité"}
					</Link>{" "}
					{globalCtx?.global.lang === "Fr"
						? "to know more about the way in which we use your personal data"
						: "en savoir plus sur la manière dont nous utilisons vos données personnelles"}
				</p>
				<JobApplication />
			</div>
		</Main>
	);
};

export default Careers;
