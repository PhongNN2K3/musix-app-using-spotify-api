import { IconContext } from "react-icons";
import { BsRepeat, BsRepeat1 } from "react-icons/bs";
import { FaPause, FaShuffle } from "react-icons/fa6";
import { IoPlay, IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import "./controls.css";

const Controls = ({
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
  isRepeated,
  setIsRepeated,
  isShuffled,
  setIsShuffled,
}) => {
  /**
   * controls của audioPlayer.jsx
   * bao gồm nút backward, play, pause, forward, repeat
   */
  return (
    <IconContext.Provider value={{ size: "40px", color: "#C4D0E3" }}>
      <div className="controls-container flex">
        <div
          className="action-btn flex"
          onClick={() => setIsShuffled(!isShuffled)}
        >
          <FaShuffle color={isShuffled ? "#0ec2aa" : "#C4D0E3"} />
        </div>
        <div className="action-btn flex" onClick={handlePrev}>
          <IoPlaySkipBack />
        </div>
        <div
          className={
            isPlaying ? "play-pause-btn active flex" : "play-pause-btn flex"
          }
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaPause /> : <IoPlay />}
        </div>
        <div className="action-btn flex" onClick={handleNext}>
          <IoPlaySkipForward />
        </div>
        <div
          className="action-btn flex"
          onClick={() => setIsRepeated(!isRepeated)}
        >
          {isRepeated ? <BsRepeat1 color="#0ec2aa" /> : <BsRepeat />}
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Controls;
