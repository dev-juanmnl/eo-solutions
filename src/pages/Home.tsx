import React, { useEffect, useContext, useState, Suspense, lazy } from "react";
import { motion, Variants } from "framer-motion";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { PageInfoType } from "../types/PageInfoType";
import { HeroSliderInfoType } from "../types/HeroSliderInfoType";
import { ProductCategoryTerm } from "../types/ProductCategoriesType";
import {
	BrowserView,
	MobileView,
	isMobile,
	isMobileOnly,
	isTablet,
	isDesktop,
} from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import orderChildrenMenu from "../components/ProductOrderedList";
import api from "../service/api";
import api_fr from "../service/api_fr";
import Main from "../layout/MainLayout";
import PageTransition from "../animations/PageTransition";
import TitleTransition from "../animations/TitleTransition";
import BlockBlueTransition from "../animations/BlockBlueTransition";
import SecondBlockTransition from "../animations/SecondBlockTransition";
import ErrorPage from "./ErrorPage";
import NewsButtonTransition from "../animations/NewsButtonTransition";
import Carousel from "react-multi-carousel";
import HeroSlider from "../blocks/HeroSlider";
import ServicesAccordeon from "../blocks/ServicesAccordeon";
import planet_goals_logo from "@/assets/images/eco_logo.svg";
import title_orange_logo from "@/assets/images/orange-bar-about-icon.svg";
import texts from "../texts.json";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-slideshow-image/dist/styles.css";
import "swiper/css";
import { text } from "stream/consumers";

const Home = () => {
	const globalCtx = useContext(GlobalContext);
	const [pageInfo, setPageInfo] = useState<PageInfoType>({
		title: "",
		body: "",
		second_body: "",
		third_body: "",
		image: "",
		alias: "",
		metaDescription: "",
	});
	const [blockPlanetGoals, setBlockPlanetGoals] = useState("");
	const [blockHomeIcons, setBlockHomeIcons] = useState("");
	const [latestNews, setLatestNews] = useState([]);
	const [heroSliderInfo, setHeroSliderInfo] = useState<HeroSliderInfoType[]>(
		[]
	);
	const [showMobileHero, setShowMobileHero] = useState(false);
	const [productCategories, setProductCategories] = useState<
		ProductCategoryTerm[]
	>([]);
	const [showError, setShowError] = useState<Boolean>(false);
	const [errorMessage, setErrorMessage] = useState(
		"Unknown error, please try again later"
	);
	const titleVariants: Variants = {
		offscreen: {
			y: 300,
		},
		onscreen: {
			y: 15,
			transition: {
				type: "spring",
				bounce: 0.7,
				duration: 2,
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
				bounce: 0.7,
				duration: 2,
			},
		},
	};
	const responsive = {
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
			slidesToSlide: 3, // optional, default to 1.
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 2,
			slidesToSlide: 2, // optional, default to 1.
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
			slidesToSlide: 1, // optional, default to 1.
		},
	};
	const load = async () => {
		try {
			setErrorMessage("Unknown error");
			setShowError(false);
			let block_url = import.meta.env.VITE_API_BLOCKS;
			let page_url = import.meta.env.VITE_API_ALL_PAGES;
			let hero_slider_url = import.meta.env.VITE_API_ALL_HERO_SLIDER;
			let our_products_url = import.meta.env.VITE_API_PRODUCTS_CATEGORIES;
			let articles_url = import.meta.env.VITE_API_ALL_ARTICLES;

			let home_page_id = import.meta.env.VITE_API_HOME_PAGE_ID;
			let block_planet_goals_id = import.meta.env
				.VITE_API_BLOCK_SUSTAINABILITY_PLANET_GOALS;
			let block_home_icons_id = import.meta.env.VITE_API_BLOCK_HOME_ICONS;
			let include = "include=field_image";
			let hero_slider_condition =
				"filter[field_page_relation.meta.drupal_internal__target_id][value]=164";
			let page_request: any = null,
				hero_slider_request: any = null,
				our_products_request: any = null;
			let latest_news_response: any = null;

			articles_url +=
				"?sort[sort-created][path]=created&sort[sort-created][direction]=DESC";

			if (globalCtx?.global.lang === "Fr") {
				page_request = await api.get(`${page_url}/${home_page_id}?${include}`);
				hero_slider_request = await api.get(
					`${hero_slider_url}?${include}&${hero_slider_condition}`
				);
				latest_news_response = await api.get(articles_url);
				our_products_request = await api.get(`${our_products_url}`);
			} else {
				block_planet_goals_id = import.meta.env
					.VITE_API_BLOCK_SUSTAINABILITY_PLANET_GOALS_FR;
				block_home_icons_id = import.meta.env.VITE_API_BLOCK_HOME_ICONS_FR;
				page_request = await api_fr.get(
					`${page_url}/${home_page_id}?${include}`
				);
				hero_slider_request = await api_fr.get(
					`${hero_slider_url}?${include}&${hero_slider_condition}`
				);
				latest_news_response = await api_fr.get(articles_url);
				our_products_request = await api_fr.get(`${our_products_url}`);
			}
			//get the page information
			let data: PageInfoType = {
				title: page_request.data.data.attributes.title,
				body:
					page_request.data.data.attributes.body !== null
						? page_request.data.data.attributes.body.value
						: "",
				second_body:
					page_request.data.data.attributes.field_second_body !== null
						? page_request.data.data.attributes.field_second_body.value
						: "",
				third_body:
					page_request.data.data.attributes.field_third_body !== null
						? page_request.data.data.attributes.field_third_body.value
						: "",
				image: "",
				alias: "/",
				metaDescription: page_request.data.data.attributes.body.summary,
			};

			//------- get the image -------
			if (page_request.data.included !== undefined) {
				if (isMobileOnly)
					data.image =
						page_request.data.included[0].attributes.image_style_uri.large;
				if (isTablet)
					data.image =
						page_request.data.included[0].attributes.image_style_uri.large;
				if (isDesktop)
					data.image = `${import.meta.env.VITE_DOMAIN_BACKEND}${
						page_request.data.included[0].attributes.uri.url
					}`;
			}
			setPageInfo(data);

			//------- get the hero slider content and images -------
			let hero_slider: HeroSliderInfoType[] = [];
			hero_slider_request?.data.data.forEach((item: any) => {
				let hero_item: HeroSliderInfoType = {
					caption: item.attributes.body.value,
					url: "",
					backgroundColor: "#002060",
					link_uri: "",
					link_title: "",
				};
				if (item.attributes.field_color_background !== null)
					hero_item.backgroundColor =
						item.attributes.field_color_background.color;
				if (item.attributes.field_link !== null) {
					hero_item.link_uri = item.attributes.field_link.uri;
					hero_item.link_title = item.attributes.field_link.title;
				}
				hero_slider.push(hero_item);
			});
			hero_slider_request.data.included.forEach((item: any, i: any) => {
				if (isMobileOnly)
					hero_slider[i].url = `${item.attributes.image_style_uri.large}`;
				if (isTablet)
					hero_slider[i].url = `${item.attributes.image_style_uri.large}`;
				if (isDesktop)
					hero_slider[i].url = `${import.meta.env.VITE_DOMAIN_BACKEND}${
						item.attributes.uri.url
					}`;
			});
			setHeroSliderInfo(hero_slider);

			//------- get latest news ------
			setLatestNews(latest_news_response.data.data);

			//------- get products -------
			//process product categories list
			let product_categories: ProductCategoryTerm[] = [];
			our_products_request.data.data.forEach((item: any) => {
				if (item.relationships.parent.data[0].id === "virtual") {
					product_categories.push({
						id: item.id,
						name: item.attributes.name,
						description:
							item.attributes.description !== null
								? item.attributes.description.value
								: "",
						alias: item.attributes.path.alias,
						children: [],
						weight: 0,
					});
				}
			});
			setProductCategories(product_categories);

			//------- planet block -------
			getBlockInformation(
				block_url,
				block_planet_goals_id,
				"planet_goals",
				globalCtx?.global.lang!
			);
			//------- home icons -------
			getBlockInformation(
				block_url,
				block_home_icons_id,
				"home_icons",
				globalCtx?.global.lang!
			);
		} catch (error: any) {
			if (typeof error === "object" && error !== null) {
				switch (error.code) {
					case "ERR_NETWORK":
						setShowError(true);
						setErrorMessage(
							"Ups!! there is a problem with the connection, please try again later"
						);
						break;
				}
			}
		}
	};
	const handleScroll = () => {
		let slides = document.querySelectorAll(".slide");
		if (slides.length > 0) {
			let hero_slider = document.getElementById("hero-slider");
			let slider_master = document.getElementById("slider-master");
			let image_overlay = document.querySelectorAll(".image-overlay");
			let top = hero_slider?.getBoundingClientRect().top;
			const height_slide = 900;
			let scrolls: any = [];
			for (let i = 0; i < slides.length; i++) {
				scrolls.push(height_slide * i);
			}
			let total_height = scrolls.length * 1000;
			if (top !== undefined) {
				let hero_slider_possition_to_top = window.pageXOffset + top;
				//--------- slides ------
				image_overlay.forEach((item: any, key) => {
					if (key === 0) {
						item.classList.add("removed");
					}
				});
				if (hero_slider_possition_to_top <= 0) {
					//slides effect
					slides.forEach((item: any, key) => {
						if (key !== 0) {
							if (hero_slider_possition_to_top <= -scrolls[key]) {
								let percentage =
									100 - -((hero_slider_possition_to_top - -scrolls[key]) / 7);
								if (percentage >= 0) {
									item.style.transform = `translate(${percentage}%, 0%) translate3d(0px, 0px, 0px)`;
									image_overlay[key].classList.remove("removed");
								} else {
									item.style.transform = `translate(0%, 0%) translate3d(0px, 0px, 0px)`;
									image_overlay[key].classList.add("removed");
								}
							} else {
								item.style.transform =
									"translate(100%, 0%) matrix(1, 0, 0, 1, 0, 0)";
							}
						}
					});
					if (hero_slider_possition_to_top <= -4000) {
						normalizeSlider(
							hero_slider,
							slider_master,
							image_overlay,
							false,
							total_height
						);
					} else {
						//--------- hero slider --------
						hero_slider?.classList.add("h-[976px]");
						hero_slider?.classList.add("pt-[5.625px]");
						//hero_slider?.classList.add(`pb-[${total_height}px]`);
						hero_slider?.style.setProperty(
							"padding-bottom",
							`${total_height}px`
						);
						hero_slider?.classList.remove("h-auto");
						hero_slider?.classList.remove("pt-0");
						//--------- slider master ------
						slider_master?.classList.add("fixed");
						slider_master?.classList.remove("relative");
					}
				} else {
					normalizeSlider(
						hero_slider,
						slider_master,
						image_overlay,
						true,
						total_height
					);
				}
			}
		}
	};
	const normalizeSlider = (
		hero_slider: any,
		slider_master: any,
		image_overlay: any,
		top: boolean,
		total_height: any
	) => {
		//--------- hero slider --------
		hero_slider?.classList.add("h-auto");
		if (top) {
			hero_slider?.style.setProperty("padding-bottom", `${total_height}px`);
			hero_slider?.style.setProperty("padding-top", "0px");
		} else {
			hero_slider?.style.setProperty("padding-top", `${total_height}px`);
			hero_slider?.style.setProperty("padding-bottom", "0px");
			hero_slider?.classList.add("pb-0");
		}
		hero_slider?.classList.remove("h-[976px]");
		hero_slider?.classList.remove("pt-[5.625px]");
		//--------- slider master ------
		slider_master?.classList.add("relative");
		slider_master?.classList.remove("fixed");
		//--------- image overlay ------
		image_overlay.forEach((item: any, key: any) => {
			if (key === 0) {
				item.classList.remove("removed");
			}
		});
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

		if (block_name === "planet_goals")
			setBlockPlanetGoals(response.data.data.attributes.body.value);
		if (block_name === "home_icons")
			setBlockHomeIcons(response.data.data.attributes.body.value);
	};
	useEffect(() => {
		load();
		window.addEventListener("scroll", () => {
			handleScroll();
		});
		setTimeout(() => {
			setShowMobileHero(true);
		}, 2000);
	}, [globalCtx?.global]);
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
				<meta name="description" content={texts.home.seo.description} />
				<meta
					name="title"
					content={`${import.meta.env.VITE_PROJECT_NAME} | Home`}
				/>
				<title>{import.meta.env.VITE_PROJECT_NAME} | Home</title>
			</Helmet>
			<Main title="" titleClass="">
				<BrowserView>
					{heroSliderInfo.length > 0 ? (
						<HeroSlider slides={heroSliderInfo} mobile={false} />
					) : (
						<div>Loading...</div>
					)}
				</BrowserView>
				{showMobileHero ? (
					<MobileView>
						<Suspense fallback={<div>Loading...</div>}>
							<HeroSlider slides={heroSliderInfo} mobile={true} />
						</Suspense>
					</MobileView>
				) : null}
				<section className="home-page page-content container m-auto relative overflow-hidden">
					<div id="our-products-wrapper" className="mt-16">
						<BlockBlueTransition>
							<div className="our-products-left blue-block flex">
								<span className="w-[20px] h-[20px] bg-eo_blue-200 block mr-4"></span>
								<p className="uppercase text-black">
									{globalCtx?.global.lang === "Fr"
										? "Our Solutions"
										: "Nos Produits"}
								</p>
							</div>
						</BlockBlueTransition>
					</div>
					<div
						className="px-4 pt-20 pb-6 lg:px-8 xl:px-36 mb-6 overflow-hidden relative"
						id="title-transition-1"
					>
						<motion.div
							initial="offscreen"
							whileInView="onscreen"
							className="relative"
						>
							<span
								className={
									isMobile ? "logo absolute -top-3" : "logo absolute top-8"
								}
							>
								<img
									className="float-right mr-6 -mt-2"
									src={title_orange_logo}
									width="auto"
									height="auto"
									alt="orange-line"
								/>
							</span>
						</motion.div>
						<motion.div
							initial="offscreen"
							whileInView="onscreen"
							className="relative"
						>
							<TitleTransition
								id={1}
								titleVariants={titleVariants}
								title_left={isMobile ? 30 : 50}
								logo_top={isMobile ? -5 : -10}
								classTitle={"two-lines"}
							>
								<div dangerouslySetInnerHTML={{ __html: pageInfo.body }} />
							</TitleTransition>
						</motion.div>
					</div>
					<motion.div
						id="products-list"
						className="mb-20"
						initial="offscreen"
						whileInView="onscreen"
					>
						<motion.div variants={blockVariants}>
							<Carousel
								ssr
								partialVisbile
								itemClass="image-item"
								responsive={responsive}
								infinite={true}
								autoPlay={true}
								className="pt-3"
								arrows={isMobile ? true : false}
								showDots={isMobile ? false : true}
							>
								{productCategories.map((item, i) => (
									<div
										className="image-item product-box shadow-box col-span-1 p-4 lg:p-10 mx-6 relative mb-20"
										key={`product-${i}`}
									>
										<h3 className="text-eo_blue-200 text-2xl text-center w-[60%] m-auto mb-6 font-semibold">
											{item.name}
										</h3>
										<div
											dangerouslySetInnerHTML={{
												__html: item.description.substring(0, 200),
											}}
										></div>
										<Link
											to={`${item.alias}`}
											className="btn-animated-products flex flex-wrap leading-6 px-4 py-4 sm:py-2 shadow-box justify-center bg-white"
										>
											<span className="btn-text">
												{globalCtx?.global.lang === "Fr"
													? "View product"
													: "Voir le produit"}
											</span>
											<span className="btn-arrow text-2xl ml-3 text-eo_orange">
												<div dangerouslySetInnerHTML={{ __html: "&#8594" }} />
											</span>
										</Link>
									</div>
								))}
							</Carousel>
						</motion.div>
					</motion.div>
				</section>
				<div id="block-1">
					<SecondBlockTransition id={1} top={50}>
						<div className="inner-block relative">
							<div className="bg-lime-900 text-white">
								<div className="container py-6 px-4 lg:px-[150px] m-auto grid grid-cols-1 lg:grid-cols-3">
									<div className="logo col-span-1 h-[300px] p-4">
										<LazyLoadImage
											src={planet_goals_logo}
											width={250}
											height={200}
											alt="planet-goals-logo"
										></LazyLoadImage>
									</div>
									<div className="description planet-goals-description col-span-2 grid grid-cols-1 content-center px-12">
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
				<div className="second-body page-content container m-auto relative">
					<div className="mt-16">
						<BlockBlueTransition>
							<div className="blue-block our-products-left flex">
								<span className="w-[20px] h-[20px] bg-eo_blue-200 block mr-4"></span>
								<p className="uppercase text-black">
									{globalCtx?.global.lang === "Fr"
										? "Our services"
										: "Nos services"}
								</p>
							</div>
						</BlockBlueTransition>
					</div>
					<div
						className="px-4 pt-20 pb-6 lg:px-36 text-sm mb-6 overflow-hidden relative"
						id="title-transition-2"
					>
						<motion.div
							initial="offscreen"
							whileInView="onscreen"
							className="relative"
						>
							<span className="logo absolute top-8">
								<img
									className="float-right mr-6 -mt-2"
									src={title_orange_logo}
									alt="orange-line"
									width="auto"
									height="auto"
								/>
							</span>
						</motion.div>
						<motion.div
							initial="offscreen"
							whileInView="onscreen"
							className="relative"
						>
							<TitleTransition
								id={2}
								titleVariants={titleVariants}
								title_left={isMobile ? 50 : 50}
								logo_top={isMobile ? -40 : -10}
								classTitle={"two-lines"}
							>
								<div
									dangerouslySetInnerHTML={{ __html: pageInfo.second_body }}
								/>
							</TitleTransition>
						</motion.div>
					</div>
				</div>
				<div id="services-accordion-wrapper">
					<img
						className="w-full"
						src={pageInfo.image}
						width="100%"
						height="auto"
						alt="accordion-service"
					/>
					<div id="block-2" className="container m-auto">
						<SecondBlockTransition id={2} top={isMobile ? 50 : 0}>
							<div className="inner-block relative">
								<Suspense fallback={<div>Loading...</div>}>
									<ServicesAccordeon fromHomePage={true} />
								</Suspense>
							</div>
						</SecondBlockTransition>
					</div>
				</div>
				<div id="second-gray">
					<div
						className="home-icons second-gray-wrapper flex flex-wrap justify-center lg:justify-around container m-auto py-10"
						dangerouslySetInnerHTML={{ __html: blockHomeIcons }}
					/>
				</div>
				{latestNews.length > 0 ? (
					<div className="third-body container relative m-auto">
						<div className="mt-16">
							<BlockBlueTransition>
								<div className="blue-block our-products-left flex">
									<span className="w-[20px] h-[20px] bg-eo_blue-200 block mr-4"></span>
									<p className="uppercase text-black">
										{globalCtx?.global.lang === "Fr" ? "News" : "Nouvelles"}
									</p>
								</div>
							</BlockBlueTransition>
						</div>
						<div
							className="px-4 pt-20 pb-10 lg:px-36 text-sm overflow-hidden relative"
							id="title-transition-3"
						>
							<motion.div
								initial="offscreen"
								whileInView="onscreen"
								className="relative"
							>
								<span className="logo absolute top-8">
									<img
										className="float-right mr-6 -mt-2"
										src={title_orange_logo}
										width="auto"
										height="auto"
										alt="orange-line"
									/>
								</span>
							</motion.div>
							<motion.div
								initial="offscreen"
								whileInView="onscreen"
								className="relative"
							>
								<TitleTransition
									id={3}
									titleVariants={titleVariants}
									title_left={50}
									logo_top={isMobile ? -40 : -10}
									classTitle={"two-lines"}
								>
									<div
										className="text-sm lg:text-base"
										dangerouslySetInnerHTML={{ __html: pageInfo.third_body }}
									/>
								</TitleTransition>
							</motion.div>
						</div>
						<motion.div
							id="related-news-list"
							className="mb-10"
							initial="offscreen"
							whileInView="onscreen"
						>
							<motion.div variants={blockVariants}>
								<Carousel
									ssr
									partialVisbile
									itemClass="image-item"
									responsive={responsive}
									infinite={true}
									autoPlay={true}
									className="pt-3"
									arrows={isMobile ? true : false}
									showDots={isMobile ? false : true}
								>
									{latestNews?.map((item: any, i) => (
										<div
											className="news-teaser col-span-1 shadow-box py-6 px-4 lg:px-10 mb-10 mx-4 overflow-hidden"
											key={`related-news-${i}`}
										>
											<h3 className="text-eo_blue-200 text-2xl text-center mb-8">
												<Link to={`${item.attributes.path.alias}`}>
													{item.attributes.title}
												</Link>
											</h3>
											<div className="body-summary text-sm text-black">
												<div
													className="text-justify"
													dangerouslySetInnerHTML={{
														__html:
															item.attributes.body !== null
																? item.attributes.body.summary
																: "",
													}}
												/>
												<NewsButtonTransition
													url={`${item.attributes.path.alias}`}
												>
													Read more
												</NewsButtonTransition>
											</div>
										</div>
									))}
								</Carousel>
							</motion.div>
						</motion.div>
					</div>
				) : null}
			</Main>
		</PageTransition>
	);
};

export default Home;
