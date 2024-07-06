import axios from "axios";
import { clientId, clientSecret } from "./spotify";

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = response.data;
    const expires_at = new Date().getTime() + expires_in * 1000;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("expires_at", expires_at);

    return access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export default refreshToken;
