import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IconContext } from "react-icons";
import { CiMenuKebab } from "react-icons/ci";
import { useClickAway } from "react-use";
import apiClient from "../../spotify";
import "./trackBtn.css";

const TrackBtn = ({ trackID, handleRemoveTrack }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTrackID, setCurrentTrackID] = useState("");
  const ref = useRef();
  let likedPlaylists = [];
  let selectedPlaylistID = window.localStorage.getItem("playlistId");

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

  useClickAway(ref, () => {
    setShowDropdown(false);
  });

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
      setShowDropdown(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveTrackFromPlaylist = (currentTrackID) => {
    try {
      apiClient.delete("/playlists/" + selectedPlaylistID + "/tracks", {
        headers: {
          "Content-Type": "application/json",
        },
        data: { tracks: [{ uri: `spotify:track:${currentTrackID}` }] },
      });
      handleRemoveTrack(currentTrackID);
      setCurrentTrackID("");
      setShowDropdown(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={ref}>
      <Dropdown show={showDropdown} onSelect={() => setShowDropdown(false)}>
        <Dropdown.Toggle
          id="dropdown-button-dark-example1"
          variant="secondary"
          as="span"
          className="track-btn"
          onClick={() => {
            setShowDropdown(!showDropdown);
            setCurrentTrackID(trackID);
          }}
        >
          <IconContext.Provider value={{ size: "24px", color: "#d2ebe7" }}>
            <CiMenuKebab />
          </IconContext.Provider>
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark" id="dropdown-menu-dark">
          <Dropdown.Item onClick={handleAddToFavorite}>
            Add to favorite
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleRemoveTrackFromPlaylist(currentTrackID)}
          >
            Remove from this playlist
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default TrackBtn;
