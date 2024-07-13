import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AudioPlayer, PlaylistInfo, Queue, SongCard } from "../../components";
import apiClient from "../../spotify";
import "./player.css";

const Player = () => {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wave, setWave] = useState(false);
  const currentPlaylist = JSON.parse(
    window.localStorage.getItem("playlists")
  ).find(
    (playlist) =>
      playlist.id ===
      (location.state?.playlistId ?? window.localStorage.getItem("playlistId"))
  );

  //lấy tracks từ id playlist đã lưu
  useEffect(() => {
    apiClient
      .get(
        `/playlists/${
          location.state?.playlistId ??
          window.localStorage.getItem("playlistId")
        }/tracks`
      )
      .then((response) => {
        setTracks(response.data.items);
        setCurrentTrack(response.data.items[0]?.track);
      })
      .catch((err) => console.log(err));
  }, [location.state]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);

  const handleRemoveTrack = (currentTrackID) => {
    setTracks((preTracks) =>
      preTracks.filter((track) => track.track.id !== currentTrackID)
    );
  };

  return (
    <div className="screen-container flex">
      <div className="left-player-container">
        <PlaylistInfo currentPlaylist={currentPlaylist} />
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setWave={setWave}
        />
      </div>
      <div className="right-player-container">
        <SongCard album={currentTrack} />
        <Queue
          tracks={tracks}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
          wave={wave}
          handleRemoveTrack={handleRemoveTrack}
        />
      </div>
    </div>
  );
};

export default memo(Player);
