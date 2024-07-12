import { IconContext } from "react-icons";
import { HiMenuAlt2 } from "react-icons/hi";
import "./menuIcon.css";

const MenuIcon = ({ setIsOpened, isOpened }) => {
  //menu icon ở mỗi thẻ bài hát ở màn hình search và favorite
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
