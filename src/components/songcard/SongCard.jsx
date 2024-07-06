import AlbumImage from "./albumImage/AlbumImage";
import AlbumInfo from "./albumInfo/AlbumInfo";
import "./songcard.css";
const SongCard = ({ album }) => {
  return (
    <div className="song-card-container flex">
      <AlbumImage img={album?.album?.images[0]?.url} />
      <AlbumInfo album={album} />
    </div>
  );
};

export default SongCard;
