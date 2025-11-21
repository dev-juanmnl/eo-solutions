import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { HeroImageProps } from "../types/HeroImageProps";
const HeroImage: React.FunctionComponent<HeroImageProps> = (
  props: HeroImageProps
) => {
  useEffect(() => {}, [props.url]);
  if (props.url !== "") {
    return (
      <div className="hero">
        <LazyLoadImage
          className="w-full"
          src={`${props.url}`}
          width={"100%"}
          height={800}
        ></LazyLoadImage>
      </div>
    );
  } else {
    return <></>;
  }
};

export default HeroImage;
