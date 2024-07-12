import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../components/imagePicker/ImagePicker";
import PlaylistForm from "../../components/playlistForm/PlaylistForm";
import { default as apiClient, default as APIKit } from "../../spotify";
import "./library.css";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReset, setIsReset] = useState(false);

  //lưu base64 của ảnh
  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  //update playlist UI
  const addNewPlaylist = (playlist) => {
    setPlaylists((prevPlaylists) => [playlist, ...prevPlaylists]);
  };

  //hàm tạo playlist được kích hoạt khi click vào nút Create ở component PlaylistForm
  const handleCreatePlaylist = async (name, description, publicStatus) => {
    if (!name.trim()) {
      setError("Playlist name cannot be empty");
      return;
    }

    //tạo playlist ở Spotify
    try {
      const response = await apiClient.post(
        `/users/${window.localStorage.getItem("spotifyID")}/playlists`,
        {
          name: name,
          description: description,
          public: !publicStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newPlaylist = response.data;

      //tạo hình ảnh cho playlist ở Spotify
      if (selectedImage) {
        apiClient.put(`/playlists/${newPlaylist.id}/images`, selectedImage, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        setError("");
        //update ảnh lên UI
        newPlaylist.images = [
          { url: `data:image/jpeg;base64, ${selectedImage}` },
        ];
        addNewPlaylist(newPlaylist);
        window.localStorage.setItem(
          "playlists",
          JSON.stringify([newPlaylist, ...playlists])
        );
        setSelectedImage(null);
        setIsReset(false);
      } else {
        setError("");
        addNewPlaylist(newPlaylist);
        window.localStorage.setItem(
          "playlists",
          JSON.stringify([newPlaylist, ...playlists])
        );
        setIsReset(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //render playlists
  useEffect(() => {
    APIKit.get("/me/playlists")
      .then((response) => {
        setPlaylists(response.data.items);
        window.localStorage.setItem(
          "playlists",
          JSON.stringify(response.data.items)
        );
      })
      .catch((err) => console.log(err));
  }, []);

  //hàm chuyển đổi playlist sang trang player
  const handlePlayPlayer = (id) => {
    navigate("/player", { state: { playlistId: id } });
    window.localStorage.setItem("playlistId", id);
  };

  return (
    <div className="screen-container">
      <div className="library-container flex">
        <div className="library-list">
          {playlists &&
            playlists.map((playlist) => (
              <div
                onClick={() => handlePlayPlayer(playlist.id)}
                className="library-item"
                key={playlist.id}
              >
                <img
                  className="library-img"
                  src={
                    playlist?.images
                      ? playlist?.images[0]?.url
                      : "../../../public/image-placeholder4.jpg"
                  }
                  alt=""
                />
                <p className="library-title">{playlist.name}</p>
                <p className="library-subtitle">
                  {playlist.tracks.total} songs
                </p>
                <div className="library-fade">
                  <IconContext.Provider
                    value={{
                      size: "46px",
                      color: "#00bfa5",
                    }}
                  >
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </div>
              </div>
            ))}
        </div>
        <div className="library-create">Create new playlist</div>
        <div className="library-form flex">
          <div className="form-img">
            <ImagePicker
              onImageSelect={handleImageSelect}
              setSelectedImage={setSelectedImage}
              isReset={isReset}
            />
          </div>
          <div className="form-container">
            <PlaylistForm
              error={error}
              handleCreatePlaylist={handleCreatePlaylist}
              setIsReset={setIsReset}
              setError={setError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
