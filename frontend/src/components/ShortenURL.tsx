import React, { useState } from "react";

const ShortenURL: React.FC<{ onShorten: (longURL: string) => void }> = ({
  onShorten,
}) => {
  const [longURL, setLongURL] = useState("");

  const handleShorten = () => {
    onShorten(longURL);
    setLongURL(""); // Clear input field after successful shorten
  };

  return (
    <div>
      <h2>Shorten URL</h2>
      <input
        type="text"
        value={longURL}
        onChange={(e) => setLongURL(e.target.value)}
        placeholder="Long URL"
      />
      <button onClick={handleShorten}>Shorten</button>
    </div>
  );
};

export default ShortenURL;
