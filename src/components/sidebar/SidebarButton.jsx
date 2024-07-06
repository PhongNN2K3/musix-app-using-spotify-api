import { IconContext } from "react-icons";
import { Link, useLocation } from "react-router-dom";
const SidebarButton = (props) => {
  let location = useLocation();
  let isActive =
    location.pathname === props.to ? "btn-container active" : "btn-container";
  return (
    <div>
      <Link to={props.to}>
        <div className={isActive}>
          <IconContext.Provider value={{ size: "24px", className: "btn-icon" }}>
            {props.icon}
          </IconContext.Provider>
          <p className="btn-title">{props.title}</p>
        </div>
      </Link>
    </div>
  );
};

export default SidebarButton;
