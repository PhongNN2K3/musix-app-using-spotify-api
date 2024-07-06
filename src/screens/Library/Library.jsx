import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import APIKit from "../../spotify";
import "./library.css";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    APIKit.get("/me/playlists")
      .then((response) => {
        setPlaylists(response.data.items);
      })
      .catch((err) => console.log(err));
  }, []);

  const handlePlayPlayer = (id) => {
    navigate("/player", { state: { playlistId: id } });
    window.localStorage.setItem("playlistId", id);
  };

  return (
    <div className="screen-container">
      <div className="library-container">
        {playlists?.map((playlist) => (
          <div
            onClick={() => handlePlayPlayer(playlist.id)}
            className="library-item"
            key={playlist.id}
          >
            <img className="library-img" src={playlist.images[0]?.url} alt="" />
            <p className="library-title">{playlist.name}</p>
            <p className="library-subtitle">{playlist.tracks.total} songs</p>
            <div className="library-fade">
              <IconContext.Provider
                value={{
                  size: "46px",
                  color: "#00bfa5",
                }}
              >
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
