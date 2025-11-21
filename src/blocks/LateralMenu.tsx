import { useEffect } from "react";
import MenuFirstLevel from "./MenuFirstLevel";
import { MenuProps } from "../types/MenuProps";
import StickyMenuMobile from "./StickyMenuMobile";
const LateralMenu: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
  useEffect(() => {
    let menu = document.getElementById("lateral-menu");
    if (props.isActive) menu?.classList.add("active");
    else menu?.classList.remove("active");
  }, [props]);
  return (
    <div
      id="lateral-menu"
      className="z-10 w-[80%] sm:w-[60%] lg:w-[450px] -left-[80%] sm:-left-[60%] lg:-left-[450px] duration-300 fixed top-0 h-full bg-white grid grid-cols-1 content-center px-10 py-4"
    >
      <button
        className="close btn bg-white border-none absolute w-[40px] h-[30px] top-2 right-2 text-eo_gray_footer text-xl"
        onClick={() => props.setActive(!props.isActive)}
      >
        X
      </button>
      <MenuFirstLevel isActive={props.isActive} setActive={props.setActive} />
      <StickyMenuMobile />
    </div>
  );
};

export default LateralMenu;
