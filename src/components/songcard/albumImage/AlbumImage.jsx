import "./albumImage.css";

const AlbumImage = ({ img }) => {
  //hình ảnh album bài hát đang phát
  return (
    <div className="album-image flex">
      <img src={img} alt="" />
      <div className="album-image-blur">
        <img src={img} alt="" />
      </div>
    </div>
  );
};

export default AlbumImage;
