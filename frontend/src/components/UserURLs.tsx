import React from "react";
import EditURL from "./EditURL";
import DeleteURL from "./DeleteURL";

const UserURLs: React.FC<{
  token: string;
  urls: any[];
  setUrls: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ token, urls, setUrls }) => {
  return (
    <div>
      <h2>User URLs</h2>
      <table>
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Long URL</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.short_code}>
              <td>
                <a
                  href={url.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{url.short_code}</strong>
                </a>
              </td>
              <td>{url.long_url}</td>
              <td>
                <EditURL
                  shortCode={url.short_code}
                  longURL={url.long_url}
                  token={token}
                  onUpdate={() => {
                    // Update the URLs after edit
                    setUrls((prevUrls) =>
                      prevUrls.map((prevUrl) =>
                        prevUrl.short_code === url.short_code ? url : prevUrl
                      )
                    );
                  }}
                />
              </td>
              <td>
                <DeleteURL
                  shortCode={url.short_code}
                  token={token}
                  onDelete={() => {
                    // Update the URLs after delete
                    setUrls((prevUrls) =>
                      prevUrls.filter(
                        (prevUrl) => prevUrl.short_code !== url.short_code
                      )
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {urls.length === 0 && <p>No URLs found.</p>}
    </div>
  );
};

export default UserURLs;
