import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import "./imagePicker.css";

const ImagePicker = ({ onImageSelect, isReset }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const options = {
    maxSizeMB: 0.256,
    maxWidthOrHeight: 192,
    useWebWorker: true,
  };
  const [error, setError] = useState(null);

  //hàm xử lý khi chọn ảnh
  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      if (file.type === "image/png") {
        //nén ảnh
        const compressedFile = await imageCompression(
          event.target.files[0],
          options
        );
        //256 là giới hạn cho phép của Spotify
        if (compressedFile.size <= 256 * 1024) {
          const reader = new FileReader();
          //load ảnh với file reader
          reader.onload = (e) => {
            setError(null);
            setSelectedImage(e.target.result);
            onImageSelect(e.target.result.split(",")[1]);
          };
          reader.readAsDataURL(compressedFile);
        } else {
          console.error("Compressed image size exceeds 256 KB");
        }
      } else {
        setError("Please select a PNG image.");
        setSelectedImage(null);
        onImageSelect(null);
      }
    } else {
      setSelectedImage(null);
      onImageSelect(null);
    }
  };

  //reset ảnh
  useEffect(() => {
    if (isReset && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.files = null;
      setSelectedImage(null);
    }
  }, [isReset]);

  return (
    <>
      <Card className="image-picker">
        <Card.Img
          variant="top"
          src={selectedImage || "../../../public/upload.jpg"}
          style={{ height: "192px", width: "192px", objectFit: "cover" }}
        />
        <Card.Body className="image-picker-body">
          <input
            ref={inputRef}
            type="file"
            accept=".png"
            hidden
            onChange={handleImageChange}
          />
          <button
            className="image-picker-button"
            onClick={() => inputRef.current.click()}
          >
            Select an image
          </button>
        </Card.Body>
      </Card>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default ImagePicker;
