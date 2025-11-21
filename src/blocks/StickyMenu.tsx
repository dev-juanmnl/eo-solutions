import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/Global";
import { Link } from "react-router-dom";
import api from "../service/api";
import fb_icon from "@/assets/images/fb-orange.svg";
import li_icon from "@/assets/images/linkedin-orange.svg";
const StickyMenu = () => {
  const globalCtx = useContext(GlobalContext);
  const [blockProductCatalogue, setBlockProductCatalogue] = useState(null);
  const getBlockInformation = async (
    block_url: string,
    block_id: string,
    block_name: string,
    lang: string
  ) => {
    let response: any = null;
    let content: any = null;
    response = await api.get(`${block_url}/${block_id}`);
    content = response.data.data.attributes.dependencies.content[0];
    content = content.replaceAll(":", "/");
    response = await api.get(`/${content}`);

    if (block_name === "product_catalogue")
      setBlockProductCatalogue(response.data.data.attributes.body.value);
  };
  useEffect(() => {
    let block_url = import.meta.env.VITE_API_BLOCKS;
    let block_product_catalogue = import.meta.env
      .VITE_API_BLOCK_PRODUCT_CATALOGUE;
    //------- blue Product Catalog link -------
    getBlockInformation(
      block_url,
      block_product_catalogue,
      "product_catalogue",
      globalCtx?.global.lang!
    );
  }, []);
  return (
    <ul
      id="sticky-menu"
      className="w-[600px] grid grid-cols-3 fixed rotate-[270deg] -right-[270px] top-[48%] h-[90px]"
    >
      <li className="col-span-1 relative">
        <div className="w-full m-auto flex flex-wrap bg-eo_gray_sticky h-[60px] py-[10px] px-12 absolute bottom-4 hover:h-[90px] hover:py-[25px] duration-300">
          <a
            href={import.meta.env.VITE_SOCIAL_LINK_LINKEDIN}
            target={"_blank"}
            className="block w-[40px] mr-5"
          >
            <img src={li_icon} className="rotate-90" alt="linkedin" />
          </a>
          <a
            href={import.meta.env.VITE_SOCIAL_LINK_FACEBOOK}
            target={"_blank"}
            className="block w-[40px]"
          >
            <img src={fb_icon} className="rotate-90" alt="facebook" />
          </a>
        </div>
      </li>
      <li className="col-span-1 relative">
        <p
          className="block text-white text-center h-[60px] w-full leading-10 bg-eo_orange py-[10px] px-5 absolute bottom-4 hover:h-[90px] hover:py-[25px] duration-300"
          id="product-catalogue"
          dangerouslySetInnerHTML={{ __html: blockProductCatalogue! }}
        ></p>
      </li>
      <li className="col-span-1 relative">
        <Link
          to={
            globalCtx?.global.lang === "Fr"
              ? "/en/contact-us"
              : "/fr/nous-contacter"
          }
          className="block text-white text-center leading-10 w-full py-[10px] px-5 h-[60px] bg-eo_gray_sticky absolute bottom-4 hover:h-[90px] hover:py-[25px] duration-300"
        >
          {globalCtx?.global.lang === "Fr" ? "Contact Us" : "Nous contacter"}
        </Link>
      </li>
    </ul>
  );
};

export default StickyMenu;
