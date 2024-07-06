import "./albumInfo.css";

const AlbumInfo = ({ album }) => {
  const artists = [];
  let dateString = album?.album?.release_date;
  let date = new Date(dateString);
  let formattedDate = {
    year: date.getFullYear(),
    month:
      date.getMonth() + 1 > 9
        ? "" + date.getMonth() + 1
        : "0" + (date.getMonth() + 1),
    day: date.getDate() > 9 ? "" + date.getDate() : "0" + date.getDate(),
  };

  album?.artists?.forEach((artist) => {
    artists.push(artist?.name);
  });

  return (
    <div className="album-info">
      <div className="album-info-name-container">
        <div className="album-info-name">
          <p>{album?.name}</p>
        </div>
      </div>
      <div className="album-info-artist">
        <p>{artists.join(", ")}</p>
      </div>
      <div className="album-info-release-date">
        <p>
          Release date:{" "}
          {formattedDate.day +
            "-" +
            formattedDate.month +
            "-" +
            formattedDate.year}
        </p>
      </div>
    </div>
  );
};

export default AlbumInfo;
