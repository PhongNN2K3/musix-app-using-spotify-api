import { AlbumImage, AlbumInfo } from "../../components";
import "./songcard.css";
const SongCard = ({ album }) => {
  //hình ảnh thông tin bài hát đang phát
  return (
    <div className="song-card-container flex">
      <AlbumImage img={album?.album?.images[0]?.url} />
      <AlbumInfo album={album} />
    </div>
  );
};

export default SongCard;
