import { useEffect, useState } from "react";
import api from "../api";

export default function Downloads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/my-paid-products/")
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Downloads error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading your downloads...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Downloads</h2>
      {files.length === 0 ? (
        <p>No purchased files yet.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            style={{
              marginBottom: "16px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <strong>{file.name}</strong>
            <br />
            {file.file ? (
              
                href={file.file}
                download
                style={{ color: "green", fontWeight: "bold" }}
              >
                Download
              </a>
            ) : (
              <span style={{ color: "gray" }}>File not available</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}