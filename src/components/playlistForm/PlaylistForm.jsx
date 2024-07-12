import { useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import "./playlistForm.css";

const PlaylistForm = ({
  handleCreatePlaylist,
  error,
  setIsReset,
  setError,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  //hàm tạo playlist được kích hoạt khi click vào nút Create
  const handleSubmit = () => {
    handleCreatePlaylist(playlistName, description, isChecked);
    setPlaylistName("");
    setDescription("");
    setIsChecked(false);
    setIsReset(true);
  };

  //playlist name không được để trống
  useEffect(() => {
    if (playlistName.trim()) {
      setError("");
    }
  }, [playlistName]);

  return (
    <Form className="playlist-form" onSubmit={(e) => e.preventDefault()}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Playlist Name</Form.Label>
        <Form.Control
          onChange={(e) => setPlaylistName(e.target.value)}
          value={playlistName}
          type="text"
          placeholder="My new playlist"
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control
          style={{ resize: "none" }}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          as="textarea"
          rows={5}
          placeholder="Enter something..."
        />
      </Form.Group>
      <div className="create-btn-container">
        <Form.Check
          type="switch"
          id="custom-switch"
          label={!isChecked ? "Public" : "Private"}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <button onClick={handleSubmit} className="create-btn">
          Create
        </button>
      </div>
    </Form>
  );
};

export default PlaylistForm;
