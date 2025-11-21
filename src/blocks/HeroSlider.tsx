import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HeroSliderProps } from "../types/HeroSliderInfoType";
import { Swiper, SwiperSlide } from "swiper/react";
import { Helmet } from "react-helmet";

const HeroSlider: React.FunctionComponent<HeroSliderProps> = (
	props: HeroSliderProps
) => {
	const [imgsLoaded, setImgsLoaded] = useState(false);
	useEffect(() => {
		const loadImage = (image) => {
			return new Promise((resolve, reject) => {
				const loadImg = new Image();
				loadImg.src = image.url;
				loadImg.onload = () =>
					setTimeout(() => {
						resolve(image.url);
					}, 2000);
				loadImg.onerror = (err) => reject(err);
			});
		};
		Promise.all(props.slides.map((image) => loadImage(image)))
			.then(() => setImgsLoaded(true))
			.catch((err) => console.log("Failed to load images", err));
	}, []);
	if (!props.mobile) {
		return (
			<div id="hero-slider">
				<div id="slider-master">
					<div id="slider-container">
						{imgsLoaded ? (
							props.slides.map((image, i) => (
								<div className="slide" key={i}>
									<div className="image-container">
										<div className="w-full h-full">
											<Link to={image.link_uri.replace("internal:", "")}>
												<div
													className="image-background"
													style={{
														backgroundImage: `url(${image.url})`,
													}}
												></div>
											</Link>
										</div>
										<div className="image-overlay"></div>
									</div>
									<div
										className="p-10 caption-hero"
										style={{ backgroundColor: image.backgroundColor }}
									>
										<div
											dangerouslySetInnerHTML={{
												__html: image.caption,
											}}
										/>
										<Link
											target={
												image.link_uri.includes("http") ? "_blank" : "_self"
											}
											to={image.link_uri.replace("internal:", "")}
										>
											{image.link_title}
										</Link>
									</div>
								</div>
							))
						) : (
							<h1 className="text-xs lg:text-sm">Loading slider...</h1>
						)}
					</div>
				</div>
			</div>
		);
	}
	return (
		<>
			{imgsLoaded ? (
				<Swiper>
					{props.slides.map((image, i) => (
						<>
							<Helmet>
								<link rel="preload" href={image.url} />
							</Helmet>
							<SwiperSlide key={i}>
								<div className="image-container w-full">
									<div
										className="image-background-mobile"
										style={{
											backgroundImage: `url(${image.url})`,
										}}
									></div>
								</div>
								<div
									className="caption-hero col-span-1 px-10"
									style={{ backgroundColor: image.backgroundColor }}
								>
									<div dangerouslySetInnerHTML={{ __html: image.caption }} />
									<Link to={image.link_uri.replace("internal:", "")}>
										{image.link_title}
									</Link>
								</div>
							</SwiperSlide>
						</>
					))}
				</Swiper>
			) : (
				<h1 className="text-xs lg:text-sm font-light">Loading slider...</h1>
			)}
		</>
	);
};

export default HeroSlider;
