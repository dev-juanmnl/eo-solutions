import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/Global";
import { MenuItemType } from "../types/MenuItemType";
import api from "../service/api";
import api_fr from "../service/api_fr";
import moment from "moment";
const Footer = () => {
  const globalCtx = useContext(GlobalContext);
  const [footerMenu, setFooterMenu] = useState<MenuItemType[]>([]);
  const [blockFooterOne, setBlockFooterOne] = useState("");
  const [blockFooterTwo, setBlockFooterTwo] = useState("");
  const load = async () => {
    try {
      let block_url = import.meta.env.VITE_API_BLOCKS;
      let block_footer_one = import.meta.env.VITE_API_BLOCK_FOOTER_ONE;
      let block_footer_two = import.meta.env.VITE_API_BLOCK_FOOTER_TWO;
      if (globalCtx?.global.lang === "En") {
        block_footer_one = import.meta.env.VITE_API_BLOCK_FOOTER_ONE_FR;
        block_footer_two = import.meta.env.VITE_API_BLOCK_FOOTER_TWO_FR;
      }
      //--------- Block footer one ---------
      getBlockInformation(
        block_url,
        block_footer_one,
        "footer_one",
        globalCtx?.global.lang!
      );
      //--------- Block footer two ---------
      getBlockInformation(
        block_url,
        block_footer_two,
        "footer_two",
        globalCtx?.global.lang!
      );
    } catch (error) {
      if (typeof error === "object" || error !== null) {
        console.error(error);
      }
    }
  };
  const loadMenu = async () => {
    let url = import.meta.env.VITE_API_FOOTER_MENU;
    if (globalCtx?.global.lang === "En")
      url = import.meta.env.VITE_API_FOOTER_MENU_FR;
    try {
      let response = await api.get(url);
      let menu: MenuItemType[] = [];
      response.data.data.forEach((item: any) => {
        let active = false;
        if (item.attributes.url === window.location.pathname) active = true;
        let menu_item: MenuItemType = {
          id: item.id,
          name: item.attributes.title,
          url: item.attributes.url,
          sub_menu: [],
          active: active,
        };
        if (item.attributes.parent === "") {
          menu.push(menu_item);
        } else {
          //search in the temporary menu the parent and assign it
          menu.forEach((item2) => {
            if (item2.id === item.attributes.parent) {
              item2.sub_menu.push(menu_item);
            }
          });
        }
      });
      setFooterMenu(menu);
    } catch (error) {}
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

    if (block_name === "footer_one")
      setBlockFooterOne(response.data.data.attributes.body.value);
    if (block_name === "footer_two")
      setBlockFooterTwo(response.data.data.attributes.body.value);
  };
  useEffect(() => {
    load();
    loadMenu();
  }, [globalCtx?.global]);
  return (
    <>
      <footer className="px-4 py-3 lg:px-10 lg:py-6 bg-eo_gray_footer text-base-content">
        <div className="container footer m-auto grid grid-cols-5">
          <div className="col-span-3 lg:col-span-4 text-white">
            <div dangerouslySetInnerHTML={{ __html: blockFooterOne }} />
          </div>
          <div className="col-span-2 lg:col-span-1 w-full block">
            <div
              className="float-right mt-[77px]"
              dangerouslySetInnerHTML={{ __html: blockFooterTwo }}
            />
          </div>
        </div>
      </footer>
      <footer className="px-2 py-2 lg:py-2 border-t-2 bg-eo_gray_footer text-base-content border-[#fff] footer-bottom">
        <div className="container footer m-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 text-white">
            <p className="text-xs mr-2 pt-2 span col-span-1">
              Copyright &copy; {moment(new Date()).format("Y")}{" "}
              {import.meta.env.VITE_PROJECT_NAME}
            </p>
            <ul className="flex text-[16px] md:text-xs lg:col-span-2">
              {footerMenu.map((item, i) => (
                <li key={`footer-${i}`} className="w-full md:w-auto">
                  <Link
                    className={
                      item.active
                        ? "bg-white text-black pl-0 lg:pr-4 py-2 md:px-2 md:py-1 inline-block text-xs lg:text-normal w-[130px] lg:w-40 text-center"
                        : "pl-0 lg:pr-4 py-2 md:px-2 md:py-1 inline-block text-xs lg:text-normal w-[130px] lg:w-40 text-center"
                    }
                    to={item.url}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:place-self-center md:justify-self-end">
            <div className="grid grid-flow-col gap-4 text-white">
              <a
                href="https://proximaweb.mu"
                target="_blank"
                className="text-xs"
              >
                {globalCtx?.global.lang === "Fr"
                  ? "Website by"
                  : "Site Web par"}{" "}
                ProximaWeb
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
