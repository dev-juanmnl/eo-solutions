import { useEffect } from "react";
import { MenuProps } from "../types/MenuProps";
const Overlay: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
  useEffect(() => {
    let overlay = document.getElementById("overlay");
    if (props.isActive) overlay?.classList.remove("no-visible");
    else overlay?.classList.add("no-visible");
  }, [props]);
  return (
    <div
      id="overlay"
      className="fixed h-full w-full bg-black opacity-30 top-0 cursor-pointer no-visible"
      onClick={() => props.setActive(!props.isActive)}
    ></div>
  );
};

export default Overlay;
