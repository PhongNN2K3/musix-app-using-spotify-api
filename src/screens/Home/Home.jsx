import axios from "axios";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MenuIcon, MobileSidebar, Sidebar } from "../../components";
import refreshToken from "../../refreshToken";
import {
  Favorite,
  Library,
  Login,
  Player,
  Search,
  Trending,
} from "../../screens";
import { clientId, clientSecret, redirectUri } from "../../spotify";
import "./home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //xác thực và lấy mã bao gồm access token, refresh token, expires_at
  useEffect(() => {
    const fetchToken = async (code) => {
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { access_token, refresh_token, expires_in } = response.data;
        const expires_at = new Date().getTime() + expires_in * 1000;

        localStorage.setItem("access_token", access_token);
        setIsAuthenticated(true);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", expires_at);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchToken(code);
    }
  }, []);

  //kiểm tra token đã hết hạn chưa, refresh token trước khi hết hạn để đảm bảo trải nghiệm
  useEffect(() => {
    const checkTokenExpiry = async () => {
      const expiresAt = localStorage.getItem("expires_at");
      const now = new Date().getTime();

      if (expiresAt && now > expiresAt - 60000) {
        await refreshToken();
      }

      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsOpened(false);
    } else {
      setIsOpened(true);
    }
  }, [windowWidth]);

  return !isAuthenticated ? (
    <Login />
  ) : (
    <Router>
      <div className="main-container">
        <Sidebar setIsAuthenticated={setIsAuthenticated} />
        {isOpened && (
          <MobileSidebar
            isOpened={isOpened}
            setIsOpened={setIsOpened}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
        {!isOpened && window.innerWidth <= 768 && (
          <MenuIcon setIsOpened={setIsOpened} />
        )}
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Home;
