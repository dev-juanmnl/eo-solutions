import { useEffect, useState } from "react";
import api from "../service/api";
import { ImageProductProps } from "../types/ImageProductProps";
import ImageGallery from "react-image-gallery";
import { isMobileOnly, isTablet, isDesktop } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import previewProductImage from "../assets/images/product-preview.jpg";

const ImageProduct: React.FunctionComponent<ImageProductProps> = (
  props: ImageProductProps
) => {
  interface ImageI {
    original: string;
    thumbnail: string;
  }
  const [imageList, setImageList] = useState<ImageI[]>([]);
  const load = () => {
    try {
      //get list of images
      let image_list: any = [];
      let response: any = null;
      if (props.images !== undefined) {
        props.images.forEach(async (item: any) => {
          response = await api.get(
            `${import.meta.env.VITE_API_FILE}/${item.id}`
          );
          if (isMobileOnly) {
            image_list.push({
              original: response.data.data.attributes.image_style_uri.large,
              thumbnail:
                response.data.data.attributes.image_style_uri.thumbnail,
            });
          }
          if (isTablet) {
            image_list.push({
              original: response.data.data.attributes.image_style_uri.wide,
              thumbnail:
                response.data.data.attributes.image_style_uri.thumbnail,
            });
          }
          if (isDesktop) {
            image_list.push({
              original: response.data.data.attributes.image_style_uri.wide,
              thumbnail:
                response.data.data.attributes.image_style_uri.thumbnail,
            });
          }
          setImageList(image_list);
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    load();
  }, [props.images]);
  if (imageList.length === 0)
    return (
      <div id="gallery">
        <LazyLoadImage
          className={
            props.isGallery === false
              ? "border border-gray-300 w-full"
              : "mb-10 w-[90%] lg:w-[70%] m-auto"
          }
          src={previewProductImage}
        />{" "}
      </div>
    );
  if (props.isGallery)
    return (
      <div id="gallery">
        <ImageGallery items={imageList} thumbnailPosition={"bottom"} />
      </div>
    );
  else
    return (
      <LazyLoadImage
        className="border border-gray-300 w-full h-[200px]"
        src={imageList.length > 0 ? `${imageList[0].original}` : ""}
        effect="blur"
        width={250}
        height={200}
        alt="product-image"
      ></LazyLoadImage>
    );
};

export default ImageProduct;
