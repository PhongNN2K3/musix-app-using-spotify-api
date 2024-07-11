import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IconContext } from "react-icons";
import { CiMenuKebab } from "react-icons/ci";
import { useClickAway } from "react-use";
import apiClient from "../../spotify";

const RemoveBtn = ({ trackID, handleRemoveTrack }) => {
  const [currentTrackID, setCurrentTrackID] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPlaylistID, setSelectedPlaylistID] = useState("");
  let playlists = JSON.parse(window.localStorage.getItem("playlists"));
  const [showChildDropdown1, setShowChildDropdown1] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(true);

  useClickAway(ref, () => {
    setShowDropdown(false);
  });

  useEffect(() => {
    if (selectedPlaylistID) {
      try {
        apiClient.post(`/playlists/${selectedPlaylistID}/tracks`, {
          uris: [`spotify:track:${currentTrackID}`],
        });
        setSelectedPlaylistID("");
        setCurrentTrackID("");
      } catch (error) {
        console.error(error);
      }
    }
  }, [selectedPlaylistID]);

  useEffect(() => {
    if (isSaved) {
      try {
        apiClient.delete("/me/tracks", {
          headers: {
            "Content-Type": "application/json",
          },
          data: { ids: [currentTrackID] },
        });
        setIsSaved(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      handleRemoveTrack(currentTrackID);
      setCurrentTrackID("");
    }
  }, [isSaved]);

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
          <Dropdown.Item eventKey="1" onClick={() => setIsSaved(true)}>
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
              <Dropdown.Menu
                align="start"
                variant="dark"
                className="dropdown-submenu"
              >
                {playlists?.map((playlist, index) => (
                  <Dropdown.Item
                    onClick={() => setSelectedPlaylistID(playlist.id)}
                    eventKey={playlist.id}
                    className="custom-dropdown-item"
                    key={index}
                  >
                    {playlist.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default RemoveBtn;
