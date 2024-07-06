import { loginEndpoint } from "../../spotify";
import "./login.css";

const Login = () => {
  const spotifySignupUrl = "https://www.spotify.com/signup";
  return (
    <div className="login-container">
      <div className="login-title">
        <img
          src="../../../spotify.png"
          className="login-logo"
          alt="spotify logo"
        />
        <h1 className="login-text">Spotify</h1>
      </div>
      <a href={loginEndpoint}>
        <div className="login-btn">Log in</div>
      </a>
      <div className="login-footer">
        Haven't had an account yet?
        <a href={spotifySignupUrl} className="login-footer-link">
          Sign up on open.spotify.com
        </a>
      </div>
    </div>
  );
};

export default Login;
