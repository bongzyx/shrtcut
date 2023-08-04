import React, { useState } from "react";
import { editURL } from "../api";

const EditURL: React.FC<{
  shortCode: string;
  longURL: string;
  token: string;
  onEdit: () => void;
}> = ({ shortCode, longURL, token, onEdit }) => {
  const [newLongURL, setNewLongURL] = useState(longURL);

  const handleEdit = () => {
    editURL(shortCode, newLongURL, token)
      .then(() => {
        alert("URL edited successfully");
        onEdit(); // Fetch updated URLs after successful edit
      })
      .catch((error) => {
        alert(error.error || "Error occurred while editing URL");
      });
  };

  return (
    <div>
      <h2>Edit URL</h2>
      <input
        type="text"
        value={newLongURL}
        onChange={(e) => setNewLongURL(e.target.value)}
        placeholder="New Long URL"
      />
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default EditURL;
