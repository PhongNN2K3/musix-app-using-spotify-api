import { IconContext } from "react-icons";
import { FiChevronRight } from "react-icons/fi";
import WidgetEntry from "../widgetEntry/WidgetEntry";
import "./widgetCard.css";

const WidgetCard = ({ title, similar, featured, newReleases }) => {
  //các khung related artist, playlist nổi bật, album mới nhất dưới khung audio
  return (
    <div className="widget-card-container">
      <p className="widget-title">{title}</p>
      {similar
        ? similar.map((artist, index) => {
            return (
              <WidgetEntry
                title={artist?.name}
                subtitle={artist?.followers?.total + " follovers"}
                image={artist?.images[2]?.url}
                key={index}
              />
            );
          })
        : featured
        ? featured.map((playlist, index) => {
            return (
              <WidgetEntry
                title={playlist?.name}
                subtitle={playlist?.tracks?.total + " songs"}
                image={playlist?.images[0]?.url}
                key={index}
              />
            );
          })
        : newReleases
        ? newReleases.map((album, index) => {
            return (
              <WidgetEntry
                title={album?.name}
                subtitle={album?.artists[0]?.name}
                image={album?.images[2]?.url}
                key={index}
              />
            );
          })
        : null}
      <div className="widget-card-fade">
        <IconContext.Provider value={{ size: "26px", color: "#fff" }}>
          <FiChevronRight />
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default WidgetCard;
