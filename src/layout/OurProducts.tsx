import { useEffect, useContext, lazy } from "react";
import { GlobalContext } from "../context/Global";
import { Helmet } from "react-helmet";
import { motion, Variants } from "framer-motion";
import { PageInfoType } from "../types/PageInfoType";
import { isMobile } from "react-device-detect";
const Main = lazy(() => import("./MainLayout"));
const HeroImage = lazy(() => import("../blocks/HeroImage"));
const OurProductsAccordion = lazy(
	() => import("../blocks/OurProductsAccordion")
);
const ContactUs = lazy(() => import("../blocks/ContactUs"));
const CustomBreadcrumb = lazy(() => import("../components/CustomBreadcrumb"));
const SecondBlockTransition = lazy(
	() => import("../animations/SecondBlockTransition")
);
const TitleTransition = lazy(() => import("../animations/TitleTransition"));
import benefits_icon from "@/assets/images/benefits.svg";
import customer_icon from "@/assets/images/customer-icon-orange.svg";
const OurProducts: React.FunctionComponent<PageInfoType> = (
	props: PageInfoType
) => {
	const globalCtx = useContext(GlobalContext);
	const titleVariants: Variants = {
		offscreen: {
			y: 300,
		},
		onscreen: {
			y: -50,
			transition: {
				type: "spring",
				bounce: 0.5,
				duration: 1.2,
			},
		},
	};
	const init = () => {
		globalCtx?.updateProductCategories(globalCtx.global.lang);
	};
	useEffect(() => {
		setTimeout(() => {
			init();
		}, 1000);
	}, [globalCtx?.global.lang]);
	return (
		<Main title="" titleClass="">
			<Helmet>
				<title>
					{import.meta.env.VITE_PROJECT_NAME} | {props.title}
				</title>
				<meta name="description" content={props.metaDescription} />
			</Helmet>
			<h1 className="text-center py-4 text-eo_orange uppercase">
				{props.title}
			</h1>
			<HeroImage url={props.image} />
			<div className="m-auto container" id="page-our-products">
				<CustomBreadcrumb />
				<div
					className="content-header page-content grid grid-cols-8 pt-16 relative h-auto lg:h-[400px]"
					id="title-transition-1"
				>
					<span className="col-span-2 logo">
						<img
							className="float-right mr-6 -mt-2"
							src={customer_icon}
							width="104px"
							height="142px"
							alt="customer-icon"
						/>
					</span>
					<motion.div
						className="col-span-6 relative mt-12"
						initial="offscreen"
						whileInView="onscreen"
					>
						<TitleTransition
							id={1}
							titleVariants={titleVariants}
							logo_top={isMobile ? 0 : 25}
							title_left={isMobile ? 0 : 100}
							classTitle={"two-lines"}
						>
							<div dangerouslySetInnerHTML={{ __html: props.body }} />
						</TitleTransition>
					</motion.div>
				</div>
				<div id="block-1" className="container m-auto">
					<SecondBlockTransition id={1} top={isMobile ? 40 : 90}>
						<div className="inner-block relative">
							<OurProductsAccordion />
						</div>
					</SecondBlockTransition>
				</div>
				<div
					className="grid grid-cols-8 benefits-wrapper relative overflow-hidden h-auto mt-10 lg:mt-36 benefits"
					id="title-transition-2"
				>
					<span className="col-span-2 mt-6 logo">
						{props.third_body == null ? (
							<img
								className="float-right mr-6 -mt-2"
								src={benefits_icon}
								alt="benefit-icon"
							/>
						) : null}
					</span>
					<motion.div
						className="col-span-6 relative mt-12"
						initial="offscreen"
						whileInView="onscreen"
					>
						<TitleTransition
							id={2}
							titleVariants={titleVariants}
							logo_top={25}
							title_left={isMobile ? 25 : 100}
							classTitle={"one-line"}
						>
							<div dangerouslySetInnerHTML={{ __html: props.second_body }} />
						</TitleTransition>
					</motion.div>
				</div>
				{props.third_body !== null ? (
					<div
						className="grid grid-cols-8 benefits-wrapper relative overflow-hidden h-auto mt-4 benefits"
						id="title-transition-2"
					>
						<span className="col-span-2 mt-6 logo">
							<img
								className="float-right mr-6 -mt-2"
								src={benefits_icon}
								alt="benefit-icon"
							/>
						</span>
						<motion.div
							className="col-span-6 relative mt-12"
							initial="offscreen"
							whileInView="onscreen"
						>
							<TitleTransition
								id={2}
								titleVariants={titleVariants}
								logo_top={25}
								title_left={isMobile ? 25 : 100}
								classTitle={"one-line"}
							>
								<div dangerouslySetInnerHTML={{ __html: props.third_body }} />
							</TitleTransition>
						</motion.div>
					</div>
				) : null}
				<ContactUs />
			</div>
		</Main>
	);
};

export default OurProducts;
