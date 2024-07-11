import Avatar from "avatar-initials";
import { useEffect, useState } from "react";
import { FaGripfire, FaPlay, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import apiClient from "../../spotify";
import "./sidebar.css";
import SidebarButton from "./SidebarButton";

const Sidebar = ({ setIsAuthenticated }) => {
  const [avatar, setAvatar] = useState();

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
    <div className="sidebar-container">
      <img src={avatar} className="avatar" alt="avatar" />
      <div>
        <SidebarButton title="Search" to="/search" icon={<FaSearch />} />
        <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
        <SidebarButton title="Favorite" to="/favorite" icon={<MdFavorite />} />
        <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton
        title="Sign Out"
        to=""
        icon={<FaSignOutAlt onClick={handleSignOut} />}
      />
    </div>
  );
};

export default Sidebar;
