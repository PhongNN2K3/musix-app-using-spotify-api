import "./playingState.css";

const PlayingState = () => {
  return (
    <div className="wave-body">
      <div className="wave1" style={{ "--i": 1 }}></div>
      <div className="wave2" style={{ "--i": 2 }}></div>
      <div className="wave3" style={{ "--i": 3 }}></div>
      <div className="wave4" style={{ "--i": 4 }}></div>
      <div className="wave5" style={{ "--i": 5 }}></div>
    </div>
  );
};

export default PlayingState;
