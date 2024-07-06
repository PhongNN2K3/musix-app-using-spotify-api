import "./albumImage.css";

const AlbumImage = ({ img }) => {
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
