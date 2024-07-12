import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import TrackCard from "../../components/trackCard/TrackCard";
import apiClient from "../../spotify";
import "./search.css";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  var audioSrc = tracks[currentIndex]?.preview_url;
  const audioRef = useRef(new Audio(tracks[0]?.preview_url));
  const intervalRef = useRef();
  const isReady = useRef(false);

  //đặt interval để phát cho đến hết
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      }
    }, 1000);
  };

  //phát/dừng mỗi khi click nút play/pause
  useEffect(() => {
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.play();
        startTimer();
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    } else {
      if (isPlaying) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.play();
        startTimer();
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  //phát mỗi khi bài hát thay đổi
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [currentIndex]);

  //chuyển bài hát tiếp theo
  const handleNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  //chức năng search bài hát theo tên bài hát hoặc tên nghệ sĩ
  useEffect(() => {
    apiClient
      .get("/search", {
        params: {
          q: searchInput,
          type: "track",
        },
      })
      .then((response) => {
        setTracks(response.data.tracks.items);
      })
      .catch((err) => console.log(err));
    console.log("render");
  }, [searchInput]);

  //xóa màn hình search khi input rỗng
  useEffect(() => {
    if (!searchInput) {
      setTracks([]);
      setIsPlaying(false);
    }
  }, [searchInput]);

  //cleanup function
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
      setCurrentIndex(0);
      setIsPlaying(false);
      isReady.current = false;
    };
  }, []);

  return (
    <div className="screen-container search-body">
      <div className="search-bar">
        <Form onSubmit={async (e) => e.preventDefault()}>
          <Form.Group className="m-5" controlId="search">
            <Form.Control
              type="text"
              placeholder="Please enter an artist or a song's name for searching songs"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
          </Form.Group>
        </Form>
      </div>
      {tracks.length > 0 && (
        <div className="search-screen-body">
          <Container>
            <Row className="m-5 row-cols-1 row-cols-md-2 row-cols-lg-4">
              {tracks.map((track, index) => {
                return (
                  <Col className="my-3" key={index}>
                    <TrackCard
                      track={track}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      index={index}
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
                      tracks={tracks}
                    />
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Search;
