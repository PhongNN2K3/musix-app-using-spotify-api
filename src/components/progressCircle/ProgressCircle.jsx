import "./progressCircle.css";

const Circle = ({ size, color, percentage, strokeWidth }) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius - 20;
  const strokePercentage =
    (circumference * (100 - Math.round(percentage))) / 100;
  return (
    <circle
      r={radius}
      cx="50%"
      cy="50%"
      fill="transparent"
      stroke={strokePercentage !== circumference ? color : ""}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={percentage ? strokePercentage : 0}
      strokeLinecap="round"
    ></circle>
  );
};

const ProgressCircle = ({ size, color, percentage, isPlaying, image }) => {
  return (
    <div className="progress-circle-container flex">
      <svg height={size} width={size}>
        <g>
          <Circle color="#384F73" size={size} strokeWidth={"0.4rem"} />
          <Circle
            color={color}
            size={size}
            percentage={percentage}
            strokeWidth={"0.6rem"}
          />
        </g>
        <defs>
          <clipPath id="my-cycle">
            <circle cx="50%" cy="50%" r={size / 2 - 30} fill="white" />
          </clipPath>
          <clipPath id="my-inner-cycle">
            <circle cx="50%" cy="50%" r={size / 2 - 100} fill="white" />
          </clipPath>
        </defs>
        <image
          className={isPlaying ? "active" : ""}
          x="30"
          y="30"
          height={2 * (size / 2 - 30)}
          width={2 * (size / 2 - 30)}
          href="../../../disco.png"
          clipPath="url(#my-cycle)"
        />
        <image
          className={isPlaying ? "active" : ""}
          x="100"
          y="100"
          height={2 * (size / 2 - 100)}
          width={2 * (size / 2 - 100)}
          href={image}
          clipPath="url(#my-inner-cycle)"
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
