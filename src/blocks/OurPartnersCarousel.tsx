import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { GlobalContext } from "../context/Global";
import api from "../service/api";
import { Brand } from "../types/BrandType";
import "react-multi-carousel/lib/styles.css";
import { isMobile } from "react-device-detect";
const OurPartnersCarousel = () => {
	const globalCtx = useContext(GlobalContext);
	const [partners, setPartners] = useState<Brand[]>([]);
	const load = async () => {
		try {
			let brands: Brand[] = [];
			let url = import.meta.env.VITE_API_BRANDS;
			let include = "include=field_image";
			let request_brands = await api.get(`${url}?${include}`);
			request_brands.data.included.forEach((item: any) => {
				let brand = {
					image: item.attributes.uri.url,
					tid: 0,
					name: "",
				};
				brands.push(brand);
			});
			let counter = 0;
			request_brands.data.data.forEach((item: any) => {
				brands[counter].tid = item.attributes.drupal_internal__tid;
				brands[counter].name = item.attributes.name;
				counter++;
			});
			setPartners(brands);
		} catch (error) {
			if (typeof error !== "object" && error !== null) {
				console.error(error);
			}
		}
	};
	const responsive = {
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 6,
			slidesToSlide: 1, // optional, default to 1.
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 3,
			slidesToSlide: 1, // optional, default to 1.
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 2,
			slidesToSlide: 1, // optional, default to 1.
		},
	};
	useEffect(() => {
		load();
	}, []);
	return (
		<Carousel
			ssr
			itemClass="image-item"
			responsive={responsive}
			infinite={true}
			autoPlay={true}
			centerMode={true}
			arrows={isMobile ? false : true}
		>
			{partners.map((item, i) => (
				<div key={i}>
					<Link
						to={`${
							globalCtx?.global.lang === "Fr"
								? "/en/page/our-solutions/all/all"
								: "/fr/page/nos-produits/all/all"
						}?brand=${item.tid}&brand_name=${item.name}`}
					>
						<img
							className="w-[150px] h-auto"
							src={`${import.meta.env.VITE_DOMAIN_BACKEND}${item.image}`}
							alt={`partner-${i}`}
						/>
					</Link>
				</div>
			))}
		</Carousel>
	);
};

export default OurPartnersCarousel;
