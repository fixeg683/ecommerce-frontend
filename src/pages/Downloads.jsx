import { useEffect, useState } from "react";

export default function Downloads() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("https://your-backend-url/api/my-downloads/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Downloads</h2>

      {files.length === 0 ? (
        <p>No purchased files yet.</p>
      ) : (
        files.map(file => (
          <div key={file.id} style={{ marginBottom: "10px" }}>
            <strong>{file.name}</strong>
            <br />
            <a href={`https://your-backend-url${file.download_url}`}>
              Download
            </a>
          </div>
        ))
      )}
    </div>
  );
}