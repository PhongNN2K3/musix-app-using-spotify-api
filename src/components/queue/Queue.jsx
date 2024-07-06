import PlayingState from "../playingState/PlayingState";
import "./queue.css";
const Queue = ({
  tracks,
  currentIndex,
  setCurrentIndex,
  setChangedIndex,
  wave,
}) => {
  const changeTimer = (duration) => {
    const min = Math.floor(duration / 1000 / 60);
    const sec = Math.floor((duration / 1000) % 60);
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  };

  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="queue-upNext">Up next</p>
        <div className="queue-list">
          {tracks.map((track, index) => (
            <div
              onClick={() => {
                setChangedIndex(index);
                setCurrentIndex(index);
              }}
              className={
                currentIndex === index
                  ? "queue-item active flex"
                  : "queue-item flex"
              }
              key={index}
            >
              <p className="queue-item-title">
                {wave && currentIndex === index ? (
                  <div className="wave-animation-container">
                    <PlayingState />
                    <p>{track.track.name}</p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ margin: "0", width: "15px" }}>
                      {index + 1 + ". "}
                    </div>
                    <p>{track.track.name}</p>
                  </div>
                )}
              </p>
              <p className="queue-item-duration">
                {changeTimer(track.track.duration_ms)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Queue;
