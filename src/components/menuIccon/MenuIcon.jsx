import { IconContext } from "react-icons";
import { HiMenuAlt2 } from "react-icons/hi";
import "./menuIcon.css";

const MenuIcon = ({ setIsOpened, isOpened }) => {
  return (
    <IconContext.Provider value={{ size: "36px", color: "#d2ebe7" }}>
      <div
        className={isOpened ? "menu-icon active flex" : "menu-icon flex"}
        onClick={() => setIsOpened(true)}
      >
        <HiMenuAlt2 />
      </div>
    </IconContext.Provider>
  );
};

export default MenuIcon;
