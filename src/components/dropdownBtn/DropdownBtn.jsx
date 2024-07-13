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
  let likedPlaylists = [];

  useEffect(() => {
    try {
      apiClient
        .get("/me/tracks")
        .then((response) => {
          likedPlaylists = response.data.items;
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  //add bài hát vào liked playlist
  const handleAddToFavorite = () => {
    let isExisted = likedPlaylists.some(
      (playlist) => playlist.track.id === currentTrackID
    );

    if (isExisted) {
      return;
    }
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
      setCurrentTrackID("");
      setShowChildDropdown1(false);
    } catch (error) {
      console.error(error);
    }
  };

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
          <Dropdown.Item eventKey="1" onClick={handleAddToFavorite}>
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
              <div className="dropdown-submenu-container">
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
              </div>
            )}
          </Dropdown>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default memo(DropdownBtn);
