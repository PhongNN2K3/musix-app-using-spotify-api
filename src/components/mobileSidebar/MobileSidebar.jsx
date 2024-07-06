import Avatar from "avatar-initials";
import { useEffect, useState } from "react";
import { FaGripfire, FaPlay, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdFavorite, MdSpaceDashboard } from "react-icons/md";
import placeholder from "../../../public/person.png";
import apiClient from "../../spotify";
import SidebarButton from "../sidebar/SidebarButton";
import "./mobileSidebar.css";

const MobileSidebar = ({ isOpened, setIsOpened, setIsAuthenticated }) => {
  const [avatar, setAvatar] = useState(placeholder);

  useEffect(() => {
    apiClient
      .get("/me")
      .then((res) => {
        setAvatar(
          res.data.images[0]?.url ?? Avatar.gravatarUrl(res.data.email)
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSignOut = () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("expires_at");
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <div>
      <div
        className={isOpened ? "sidebar-body active flex" : "sidebar-body flex"}
      >
        <div className="sidebar-top">
          <img src={avatar} className="avatar" alt="avatar" />
        </div>

        <div className="sidebar-mid">
          <SidebarButton title="Feed" to="/feed" icon={<MdSpaceDashboard />} />
          <SidebarButton
            title="Trending"
            to="/trending"
            icon={<FaGripfire />}
          />
          <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
          <SidebarButton
            title="Favorite"
            to="/favorite"
            icon={<MdFavorite />}
          />
          <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
        </div>
        <div className="sidebar-bottom">
          <SidebarButton
            title="Sign Out"
            to=""
            icon={<FaSignOutAlt onClick={handleSignOut} />}
          />
        </div>
      </div>
      <div className="close-btn" onClick={() => setIsOpened(false)}>
        <FaTimes />
      </div>
    </div>
  );
};

export default MobileSidebar;
