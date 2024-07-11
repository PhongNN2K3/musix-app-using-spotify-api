import { memo, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import FavoriteCard from "../../components/favoriteCard/FavoriteCard";
import apiClient from "../../spotify";
import "./favorite.css";

const Favorite = () => {
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  var audioSrc = likedPlaylists[currentIndex]?.track?.preview_url;
  const audioRef = useRef(new Audio(likedPlaylists[0]?.track?.preview_url));
  const intervalRef = useRef();
  const isReady = useRef(false);

  useEffect(() => {
    try {
      apiClient
        .get("/me/tracks")
        .then((response) => {
          setLikedPlaylists(response.data.items);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleRemoveTrack = (trackId) => {
    setLikedPlaylists((prevPlaylists) =>
      prevPlaylists.filter((playlist) => playlist.track.id !== trackId)
    );
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      }
    }, 1000);
  };

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

  const handleNext = () => {
    if (currentIndex < likedPlaylists.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

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
    <div className="screen-container favorite-screen">
      <div className="favorite-title">
        <h1>My Favorite songs</h1>
      </div>
      {likedPlaylists.length > 0 && (
        <div className="favorite-body">
          <Container>
            <Row className="m-5 row-cols-1 row-cols-md-2 row-cols-lg-4">
              {likedPlaylists.map((track, index) => {
                return (
                  <Col className="my-3" key={index}>
                    <FavoriteCard
                      track={track.track}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      index={index}
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
                      handleRemoveTrack={handleRemoveTrack}
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

export default memo(Favorite);
