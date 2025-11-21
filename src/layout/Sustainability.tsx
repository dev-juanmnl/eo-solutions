import { useState, useEffect, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
import { BrowserView, MobileView } from "react-device-detect";
import api from "../service/api";
import api_fr from "../service/api_fr";
const Main = lazy(() => import("./MainLayout"));
const HeroImage = lazy(() => import("../blocks/HeroImage"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const BlockBlueTransition = lazy(
	() => import("../animations/BlockBlueTransition")
);
const NewsButtonTransition = lazy(
	() => import("../animations/NewsButtonTransition")
);
const SecondBlockTransition = lazy(
	() => import("../animations/SecondBlockTransition")
);
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
import planet_goals_logo from "@/assets/images/eco_logo.svg";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
const News: React.FunctionComponent<PageInfoType> = (props: PageInfoType) => {
	const globalCtx = useContext(GlobalContext);
	const [sustainabilityList, setSustainabilityList] = useState([]);
	const [blockBlueLeft, setBlockBlueLeft] = useState("");
	const [blockPlanetGoals, setBlockPlanetGoals] = useState("");
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
	const load = async () => {
		try {
			let url = import.meta.env.VITE_API_ALL_ARTICLES;
			let filter =
				"[field_news_categories.meta.drupal_internal__target_id][value]=3";
			let sort =
				"sort[sort-created][path]=created&sort[sort-created][direction]=DESC";
			//load sustainability article's list
			let result: any = null;
			if (globalCtx?.global.lang === "Fr")
				result = await api.get(`${url}?filter${filter}&${sort}`);
			else result = await api_fr.get(`${url}?filter${filter}&${sort}`);
			setSustainabilityList(result.data.data);
			let block_url = import.meta.env.VITE_API_BLOCKS;
			let block_blue_sustainability = import.meta.env
				.VITE_API_BLOCK_SUSTAINABILITY_BLUE;
			let block_planet_goals = import.meta.env
				.VITE_API_BLOCK_SUSTAINABILITY_PLANET_GOALS;
			if (globalCtx?.global.lang === "En") {
				block_blue_sustainability = import.meta.env
					.VITE_API_BLOCK_SUSTAINABILITY_BLUE_FR;
				block_planet_goals = import.meta.env
					.VITE_API_BLOCK_SUSTAINABILITY_PLANET_GOALS_FR;
			}
			//--------- Block footer one ---------
			getBlockInformation(
				block_url,
				block_blue_sustainability,
				"blue_left",
				globalCtx?.global.lang!
			);
			//--------- Block planet goals ---------
			getBlockInformation(
				block_url,
				block_planet_goals,
				"planet_goals",
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
		if (block_name === "planet_goals")
			setBlockPlanetGoals(response.data.data.attributes.body.value);
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
			<div className="w-full container m-auto">
				<CustomBreadcrumb />
			</div>
			<div className="sustainability-page page-content container m-auto relative overflow-hidden">
				<div
					className="px-4 pt-20 pb-20 lg:px-24 text-sm mb-6 overflow-hidden relative"
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
							title_left={0}
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
				<div
					id="sustainability-list"
					className="masonry sm:masonry-sm md:masonry-md xl:masonry-xl my-20 p-2 pt-10"
				>
					{sustainabilityList.map((item: any, index) => (
						<motion.div
							initial="offscreen"
							whileInView="onscreen"
							className="overflow-hidden p-2"
							key={`news-teaser-${index}`}
						>
							<motion.div
								className="news-teaser w-full shadow-box py-6 px-4 lg:px-10 mb-6 break-inside"
								variants={blockVariants}
							>
								<Link to={`${item.attributes.path.alias}`}>
									<h3 className="text-eo_blue-200 text-2xl text-center mb-8">
										{item.attributes.title}
									</h3>
								</Link>
								<div className="body-summary text-sm text-black">
									<div
										dangerouslySetInnerHTML={{
											__html: item.attributes.body.summary.substr(0, 200),
										}}
									></div>
									<NewsButtonTransition url={`${item.attributes.path.alias}`}>
										Read more
									</NewsButtonTransition>
								</div>
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>
			<div id="block-1">
				<SecondBlockTransition id={1} top={-10}>
					<div className="inner-block relative">
						<div className="bg-lime-900 text-white">
							<div className="container py-6 px-4 lg:px-[150px] m-auto grid grid-cols-1 lg:grid-cols-3">
								<div className="logo col-span-1 h-[300px] p-4">
									<img
										className="w-full h-full"
										src={planet_goals_logo}
										alt="planet-goals-logo"
									/>
								</div>
								<div className="description planet-goals-description col-span-2 grid grid-cols-1 content-center">
									<div className="col-span-1">
										<div
											dangerouslySetInnerHTML={{ __html: blockPlanetGoals }}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</SecondBlockTransition>
			</div>
			<div className="second-body second-body-sustainability container m-auto">
				<BrowserView>
					<div className="second-body-wrapper px-8 sm:px-16 py-8 lg:px-24 lg:py-24 h-auto relative">
						<div
							className="w-[850px]"
							dangerouslySetInnerHTML={{ __html: props.second_body }}
						/>
					</div>
				</BrowserView>
				<MobileView>
					<div className="second-body-wrapper px-16 py-2 lg:px-24 lg:py-24 h-[1350px] lg:h-[1000px] relative mt-0 md:mt-12 lg:mt-12 sustainability-list">
						<div
							className="w-[300px] lg:w-[850px]"
							dangerouslySetInnerHTML={{ __html: props.second_body }}
						/>
					</div>
				</MobileView>
			</div>
		</Main>
	);
};

export default News;
