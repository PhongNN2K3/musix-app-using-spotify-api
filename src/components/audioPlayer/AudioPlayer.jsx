import { useEffect, useRef, useState } from "react";
import { Controls, ProgressCircle, WaveAnimation } from "../../components";
import "./audioPlayer.css";

const AudioPlayer = ({
  currentTrack,
  currentIndex,
  setCurrentIndex,
  total,
  setWave,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  let audioSrc = total[currentIndex]?.track?.preview_url;
  const audioRef = useRef(new Audio(total[0]?.track?.preview_url));
  const intervalRef = useRef();
  const isReady = useRef(false);
  const { duration } = audioRef.current;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;
  const [browserScale, setBrowserScale] = useState(100);
  const [isRepeated, setIsRepeated] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const shuffledIndices = useRef([0]);
  const countRef = useRef(-1);

  //check trạng thái bài hát để chuyển tiếp hoặc theo dõi tiến trình bài hát
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  //khi click nút play/pause sẽ phát hoặc ngưng bài hát.
  /**đầu tiên kiểm tra source audio có đang present không.
   *nếu bài hát đang phát thì kiểm tra đang ở chế độ nào
   *nếu ở chế độ lặp thì phát lặp lại, ở chế độ ngẫu nhiên thì phát ngẫu nhiên hoặc phát theo thứ tự.
   */
  useEffect(() => {
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.play();
        if (isRepeated) {
          startRepeater();
        } else {
          startTimer();
        }
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    } else {
      if (isPlaying) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.play();
        if (isRepeated) {
          startRepeater();
        } else {
          startTimer();
        }
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  //khi index thay đổi dẫn đến src thay đổi sẽ thay đổi trạng thái cho bài hát tiếp theo thành sẵn sàng phát.
  //khi index thay đổi do đã hết thời gian phát hay đổi bài hát, đầu tiên sẽ kiểm tra có phải trong trạng thái phát lặp lại không.
  //nếu đúng thì phát lặp lại bài hát hiện tại
  //nếu không đúng thì phát bài hát theo danh sách ban đầu hay ngẫu nhiên.
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);
    audioRef.current.load();
    setTrackProgress(audioRef.current.currentTime);
    if (isShuffled) {
      countRef.current = shuffledIndices.current.indexOf(currentIndex);
    }

    if (isRepeated) {
      if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startRepeater();
      } else {
        isReady.current = true;
      }
    } else {
      if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
      } else {
        isReady.current = true;
      }
    }
  }, [currentIndex]);

  //cleanup function
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
      isReady.current = false;
      setIsRepeated(false);
      setIsShuffled(false);
      audioRef.current.src = null;
    };
  }, []);

  //phát bài tiếp theo
  //nếu trong chế độ ngẫu nhiên, sẽ phát bài hát tiếp theo thứ tự ngẫu nhiên với index là các phần tử của mảng shuffledIndices.current.
  //nếu không thì sẽ phát theo thứ tự gốc.
  const handleNext = () => {
    if (isShuffled) {
      if (countRef.current < total.length - 1) {
        setCurrentIndex(shuffledIndices.current[countRef.current + 1]);
        countRef.current += 1;
      } else {
        countRef.current = 0;
        setCurrentIndex(shuffledIndices.current[countRef.current]);
        if (total.length === 1) {
          setIsPlaying(false);
        }
      }
    } else {
      if (currentIndex < total.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        if (total.length === 1) {
          setIsPlaying(false);
        }
      }
    }
  };

  //phát bài hát trước đó
  //nếu trong chế độ ngẫu nhiên, sẽ phát bài hát trước đó theo thứ tự ngẫu nhiên với index là các phần tử của mảng shuffledIndices.current.
  //nếu không thì sẽ phát ngược lại theo thứ tự gốc.
  const handlePrev = () => {
    if (isShuffled) {
      if (countRef.current - 1 < 0) {
        setCurrentIndex(shuffledIndices.current[total.length - 1]);
        countRef.current = total.length - 1;
      } else {
        setCurrentIndex(shuffledIndices.current[countRef.current - 1]);
        countRef.current -= 1;
      }
    } else {
      if (currentIndex - 1 < 0) {
        setCurrentIndex(total.length - 1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  //lặp bài hát hiện tại.
  const startRepeater = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  //kiểm tra trạng thái lặp, nếu đang ở chế độ lặp lại thì phát lặp lại còn không phát bài hát tiếp theo.
  useEffect(() => {
    if (isRepeated) {
      startRepeater();
    } else {
      startTimer();
    }
  }, [isRepeated]);

  //hàm trộn mảng
  function getShuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  //mỗi lần user nhấn nút phát ngẫu nhiên sẽ thay đổi state isShuffled.
  //isShuffled = true => tạo mảng index shuffledIndices ngẫu nhiên và phát bài đầu tiên với index là phần tử đầu trong mảng shuffledIndices.current.
  //isShuffled = false => phát bài tiếp theo.
  useEffect(() => {
    if (isShuffled) {
      shuffledIndices.current = getShuffleArray([...total.keys()]);
      countRef.current = 0;
      setCurrentIndex(shuffledIndices.current[countRef.current]);
    } else {
      startTimer();
    }
  }, [isShuffled]);

  //thêm số 0 vào duration.
  const addZero = (n) => {
    if (n < 10) {
      return "0" + n;
    }
    return "" + n;
  };

  //thay đổi kích thước progress circumference theo độ rộng trình duyệt.
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const originalWidth = 1440;
      const scale = (windowWidth / originalWidth) * 100;
      setBrowserScale(scale);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setWave(true);
    } else {
      setWave(false);
    }
  }, [isPlaying]);

  const artists = currentTrack?.artists
    ?.map((artist) => artist?.name)
    .join(" | ");

  return (
    <div className="audio-player-container flex">
      <div className="audio-player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          size={(300 * browserScale) / 100}
          color="#0fe6ca"
          isPlaying={true}
          image={currentTrack?.album?.images[0]?.url}
        />
      </div>
      <div className="audio-player-right-body flex">
        <p className="song-title">{currentTrack?.name}</p>
        <p className="song-artist">{artists}</p>
        <div className="audio-player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">00:{addZero(Math.floor(trackProgress))}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration">00:29</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isRepeated={isRepeated}
            setIsRepeated={setIsRepeated}
            isShuffled={isShuffled}
            setIsShuffled={setIsShuffled}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
