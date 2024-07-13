import { memo } from "react";
import { Card } from "react-bootstrap";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { MdPauseCircle } from "react-icons/md";
import { RemoveBtn } from "../../components";
import "./favoriteCard.css";

const FavoriteCard = ({
  track,
  isPlaying,
  setIsPlaying,
  index,
  currentIndex,
  setCurrentIndex,
  handleRemoveTrack,
}) => {
  const artists = track.artists.map((artist) => artist.name).join(", ");
  //thẻ bài hát ở màn hình favorite
  return (
    <Card className="track-card bg-dark text-white">
      <Card.Img
        className="track-card-image"
        variant="top"
        src={track.album?.images[0]?.url}
      />
      <Card.Body>
        <Card.Title>{track.name}</Card.Title>
        <Card.Text>{artists}</Card.Text>
        <div className="track-card-fade"></div>
        <div className="track-btn-container">
          <div className="track-dropdown">
            <RemoveBtn
              trackID={track.id}
              handleRemoveTrack={handleRemoveTrack}
            />
          </div>
          <IconContext.Provider
            value={{
              size: "46px",
              color: "#00bfa5",
            }}
          >
            <div className="track-btn">
              {index === currentIndex && isPlaying ? (
                <MdPauseCircle onClick={() => setIsPlaying(false)} />
              ) : (
                <AiFillPlayCircle
                  className="play"
                  onClick={() => {
                    setIsPlaying(true);
                    setCurrentIndex(index);
                  }}
                />
              )}
            </div>
          </IconContext.Provider>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(FavoriteCard);
