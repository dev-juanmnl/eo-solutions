import axios from "axios";
import { useEffect, useState, lazy } from "react";
import moment from "moment";
import { JobType } from "../types/JobType";
const SecondBlockTransition = lazy(
	() => import("../animations/SecondBlockTransition")
);

interface Props {
	lang: string;
}

export default function Vacancies({ lang }: Props) {
	const [jobOffers, setJobOffers] = useState<JobType[]>([]);
	const [jobOffersLoaded, setJobOffersLoaded] = useState<boolean>(true);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const options = {
					method: "GET",
					url: import.meta.env.VITE_API_VACANCIES,
					params: { includeInternal: "false" },
					headers: { Authorization: import.meta.env.VITE_API_TOKEN },
				};
				setJobOffersLoaded(false);
				await axios
					.request(options)
					.then(function (response) {
						let tmpVacancies: JobType[] = [];
						response.data.Vacancies.forEach((item: any) => {
							if (item.DivisionId === 1847) {
								tmpVacancies = [
									...tmpVacancies,
									{
										Id: item.Id,
										JobTitle: item.JobTitle,
										Description: item.Description,
										ClosedDate: item.ClosedDate,
										Hash: item.Hash,
									},
								];
							}
						});
						setJobOffers(tmpVacancies!);
						setJobOffersLoaded(true);
					})
					.catch(function (error) {
						console.error(error);
					});
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	return (
		<div id="block-1" className="container m-auto">
			<SecondBlockTransition id={1} top={10}>
				<div className="inner-block relative">
					<div
						id="job-offers-accordion"
						className="pl-6 pt-4 sm:pl-14 sm:pt-8 xl:pl-28 xl:pt-20 pr-6 pb-6 bg-eo_gray_products text-black mt-36"
					>
						{jobOffers!.length > 0 && jobOffersLoaded ? (
							jobOffers!.map((item: JobType, index) => (
								<div
									className="collapse collapse-plus border-b-2 border-white"
									key={`job-offer-${index}`}
								>
									<input type="checkbox" className="peer" />
									<div className="collapse-title text-xl font-medium">
										{item.JobTitle}
									</div>
									<div className="collapse-content">
										<div className="description">
											<label className="text-eo_blue-200 font-bold text-sm mb-4 block">
												{lang === "Fr"
													? "Job description"
													: "Description de l'emploi"}
											</label>
											<div
												dangerouslySetInnerHTML={{
													__html: item.Description,
												}}
											></div>
										</div>
										{item.ClosedDate !== null && (
											<div className="closing-date mt-3">
												<p className="text-black">
													<label className="text-eo_blue-200 font-bold text-sm">
														{lang === "Fr"
															? "Closing Date:"
															: "Date de clôture:"}
													</label>{" "}
													{moment(item.ClosedDate).format("Do MMMM YYYY HH:mm")}
												</p>
											</div>
										)}
										<div className="mail-address mt-3">
											<p className="text-black">
												<a
													className="bg-eo_blue-200 text-white px-3 py-3 text-sm w-[200px] block text-center"
													target="_blank"
													href={`mailto:te-hrrecruitment@harelmallac.com?subject=${item.JobTitle}`}
												>
													Apply here
												</a>
											</p>
										</div>
									</div>
								</div>
							))
						) : jobOffers!.length === 0 && jobOffersLoaded ? (
							<p className="text-center">
								Thank you for your interest, but we currently have no vacancies
								for the moment
							</p>
						) : null}
					</div>
				</div>
			</SecondBlockTransition>
		</div>
	);
}
