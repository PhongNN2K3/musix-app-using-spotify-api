import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
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
        window.localStorage.setItem(
          "playlists",
          JSON.stringify(response.data.items)
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const handlePlayPlayer = (id) => {
    navigate("/player", { state: { playlistId: id } });
    window.localStorage.setItem("playlistId", id);
  };

  const handleAddNewPlaylist = () => {};

  return (
    <div className="screen-container">
      <div className="library-container flex">
        <div className="library-list">
          {playlists?.map((playlist) => (
            <div
              onClick={() => handlePlayPlayer(playlist.id)}
              className="library-item"
              key={playlist.id}
            >
              <img
                className="library-img"
                src={
                  playlist?.images
                    ? playlist?.images[0]?.url
                    : "../../../public/image-placeholder4.jpg"
                }
                alt=""
              />
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
        <div className="library-form flex">
          <div className="form-img">
            <Form>
              <Form.Control type="file" />
            </Form>
          </div>
          <div className="form-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Library;
