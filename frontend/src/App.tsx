import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import ShortenURL from "./components/ShortenURL";
import UserURLs from "./components/UserURLs";
import { loginUser, logoutUser, getUserURLs, shortenURL } from "./api";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    loginUser(username, password)
      .then((token) => {
        setToken(token);
        setIsLoggedIn(true);
        localStorage.setItem("access_token", token);
      })
      .catch((error) => {
        alert(error.error || "Error occurred during login");
      });
  };

  const handleLogout = () => {
    logoutUser().then(() => {
      setToken(null);
      setIsLoggedIn(false);
      localStorage.removeItem("access_token");
    });
  };

  const handleAddNewURL = () => {
    if (isLoggedIn) {
      // Fetch the URLs only when the user is logged in
      getUserURLs(token!)
        .then((data) => {
          setUrls(data);
        })
        .catch((error) => {
          alert(error.error || "Error occurred while fetching user URLs");
        });
    }
  };

  const handleShortenURL = (longURL: string) => {
    shortenURL(longURL, token!)
      .then(() => {
        alert("URL shortened successfully");
        handleAddNewURL(); // Call the function to fetch updated URLs
      })
      .catch((error) => {
        alert(error.error || "Error occurred while shortening URL");
      });
  };

  useEffect(() => {
    // Fetch user URLs when the component mounts and whenever the user logs in or a new URL is added
    handleAddNewURL();
  }, [isLoggedIn, token]);

  return (
    <div className="container">
      {isLoggedIn ? (
        <>
          <h1>Welcome! You are logged in.</h1>
          <button onClick={handleLogout}>Logout</button>
          <ShortenURL onShorten={handleShortenURL} />
          <UserURLs token={token!} urls={urls} setUrls={setUrls} />
        </>
      ) : (
        <>
          <Register />
          <Login onLogin={handleLogin} />
        </>
      )}
    </div>
  );
};

export default App;
