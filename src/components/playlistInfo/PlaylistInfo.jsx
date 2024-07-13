import "./playlistInfo.css";

const PlaylistInfo = ({ currentPlaylist }) => {
  return (
    <>
      <div className="playlist-info-container">
        <div className="left-body">
          <div className="playlist-image">
            <img src={currentPlaylist?.images[0]?.url} alt="" />
          </div>
          <div className="playlist-info-blur">
            <img src={currentPlaylist?.images[0]?.url} alt="" />
          </div>
        </div>
        <div className="right-body">
          <div className="playlist-info">
            <div className="playlist-info-type">{currentPlaylist?.type}</div>
            <div className="playlist-info-name">{currentPlaylist?.name}</div>
            <div className="playlist-info-description">
              {currentPlaylist?.description}
            </div>
            <div className="playlist-info-total-tracks">
              {currentPlaylist?.tracks?.total} songs
            </div>
          </div>
        </div>
      </div>
      <div class="neon-line"></div>
    </>
  );
};

export default PlaylistInfo;
