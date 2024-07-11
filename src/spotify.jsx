import axios from "axios";
import refreshToken from "./refreshToken";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:5173";
const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-library-modify",
];

export const loginEndpoint = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;

const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

// Interceptor này sẽ tự động thêm token xác thực vào header của mỗi yêu cầu nếu token tồn tại trong localStorage
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// mỗi khi token hết hạn các yêu cầu http sẽ được làm mới với token mới
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { clientId, clientSecret, redirectUri };
