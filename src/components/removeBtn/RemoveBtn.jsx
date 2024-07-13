import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IconContext } from "react-icons";
import { CiMenuKebab } from "react-icons/ci";
import { useClickAway } from "react-use";
import apiClient from "../../spotify";
import "./removeBtn.css";

const RemoveBtn = ({ trackID, handleRemoveTrack }) => {
  const [currentTrackID, setCurrentTrackID] = useState("");
  const [selectedPlaylistID, setSelectedPlaylistID] = useState("");
  let playlists = JSON.parse(window.localStorage.getItem("playlists"));
  const [showChildDropdown1, setShowChildDropdown1] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(true);

  //bấm bên ngoài thu lại dropdown
  useClickAway(ref, () => {
    setShowDropdown(false);
  });

  //add track vào danh sách playlist ở dropdown
  useEffect(() => {
    const addTrackToPlaylist = async () => {
      if (selectedPlaylistID) {
        try {
          const response = await apiClient.get(
            `/playlists/${selectedPlaylistID}/tracks`
          );
          const playlistTracks = response.data.items;

          const isTrackInPlaylist = playlistTracks.some(
            (item) => item.track.id === currentTrackID
          );

          if (isTrackInPlaylist) {
            setSelectedPlaylistID("");
            setCurrentTrackID("");
            return;
          }
          apiClient.post(`/playlists/${selectedPlaylistID}/tracks`, {
            uris: [`spotify:track:${currentTrackID}`],
          });
          setSelectedPlaylistID("");
          setCurrentTrackID("");
        } catch (error) {
          console.error(error);
        }
      }
    };

    addTrackToPlaylist();
  }, [selectedPlaylistID, currentTrackID]);

  //xóa bài hát khỏi liked playlist
  const removeTrack = (currentTrackID) => {
    try {
      apiClient.delete("/me/tracks", {
        headers: {
          "Content-Type": "application/json",
        },
        data: { ids: [currentTrackID] },
      });
      handleRemoveTrack(currentTrackID);
      setCurrentTrackID("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={ref}>
      <Dropdown show={showDropdown} onSelect={() => setShowDropdown(false)}>
        <Dropdown.Toggle
          className="dropdown-btn"
          variant="success"
          id="dropdown-basic"
          as="span"
          onClick={() => {
            setShowChildDropdown1(false);
            setCurrentTrackID(trackID);
            setShowDropdown(!showDropdown);
          }}
        >
          <IconContext.Provider value={{ size: "36px", color: "#fff" }}>
            <CiMenuKebab />
          </IconContext.Provider>
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark" className="dropdown-menu">
          <Dropdown.Item
            eventKey="1"
            onClick={() => removeTrack(currentTrackID)}
          >
            Remove from favorite
          </Dropdown.Item>
          <Dropdown
            onMouseEnter={() => setShowChildDropdown1(true)}
            onMouseLeave={() => setShowChildDropdown1(false)}
            show={setShowChildDropdown1}
            as={Dropdown.Item}
          >
            Add to playlists
            {showChildDropdown1 && (
              <div className="submenu">
                <Dropdown.Menu
                  align="start"
                  variant="dark"
                  className="submenu-body"
                >
                  {playlists?.map((playlist, index) => (
                    <Dropdown.Item
                      onClick={() => setSelectedPlaylistID(playlist.id)}
                      eventKey={playlist.id}
                      className="dropdown-items"
                      key={index}
                    >
                      {playlist.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </div>
            )}
          </Dropdown>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default RemoveBtn;
