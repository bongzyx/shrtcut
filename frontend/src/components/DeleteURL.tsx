import React from "react";
import { deleteURL } from "../api";

const DeleteURL: React.FC<{
  shortCode: string;
  token: string;
  onDelete: () => void;
}> = ({ shortCode, token, onDelete }) => {
  const handleDelete = () => {
    deleteURL(shortCode, token)
      .then(() => {
        alert("URL deleted successfully");
        onDelete(); // Fetch updated URLs after successful delete
      })
      .catch((error) => {
        alert(error.error || "Error occurred while deleting URL");
      });
  };

  return (
    <div>
      <h2>Delete URL</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteURL;
