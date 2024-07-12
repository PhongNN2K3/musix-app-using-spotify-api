import { memo, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IconContext } from "react-icons";
import { CiMenuKebab } from "react-icons/ci";
import apiClient from "../../spotify";
import "./dropdownBtn.css";

const DropdownBtn = ({ trackID }) => {
  const [selectedPlaylistID, setSelectedPlaylistID] = useState("");
  const [currentTrackID, setCurrentTrackID] = useState("");
  var playlists = JSON.parse(window.localStorage.getItem("playlists"));
  const [showChildDropdown1, setShowChildDropdown1] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  //add track vào danh sách playlist ở dropdown
  useEffect(() => {
    if (selectedPlaylistID) {
      try {
        apiClient.post(`/playlists/${selectedPlaylistID}/tracks`, {
          uris: [`spotify:track:${currentTrackID}`],
        });
        setSelectedPlaylistID("");
      } catch (error) {
        console.error(error);
      }
    }
  }, [selectedPlaylistID]);

  //add bài hát vào liked playlist
  useEffect(() => {
    if (isSaved) {
      try {
        apiClient.put(
          "/me/tracks",
          { ids: [currentTrackID] },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsSaved(false);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isSaved]);

  return (
    <>
      <Dropdown
        onClick={() => {
          setShowChildDropdown1(false);
          setCurrentTrackID(trackID);
        }}
      >
        <Dropdown.Toggle
          className="dropdown-btn"
          variant="success"
          id="dropdown-basic"
          as="span"
        >
          <IconContext.Provider value={{ size: "36px", color: "#fff" }}>
            <CiMenuKebab />
          </IconContext.Provider>
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark" className="dropdown-menu">
          <Dropdown.Item eventKey="1" onClick={() => setIsSaved(true)}>
            Add to favorite
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
    </>
  );
};

export default memo(DropdownBtn);
