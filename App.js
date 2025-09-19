import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000"; // matches Docker backend port

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortened, setShortened] = useState(null);
  const [allUrls, setAllUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all URLs
  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/urls`);
      setAllUrls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Shorten a URL
  const handleShorten = async () => {
    if (!originalUrl) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/shorten`, { original_url: originalUrl });
      setShortened(res.data);
      setOriginalUrl("");
      fetchUrls(); // update list
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Redirect to original URL
  const handleRedirect = (shortCode) => {
    window.location.href = `${BACKEND_URL}/r/${shortCode}`;
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>URL Shortener</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          style={{ width: "70%", padding: 8 }}
        />
        <button onClick={handleShorten} disabled={loading} style={{ padding: 8, marginLeft: 10 }}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {shortened && (
        <div style={{ marginBottom: 20 }}>
          <strong>Shortened URL:</strong>{" "}
          <a href={`${BACKEND_URL}/r/${shortened.short_code}`} target="_blank" rel="noreferrer">
            {`${BACKEND_URL}/r/${shortened.short_code}`}
          </a>
        </div>
      )}

      <h2>All Shortened URLs</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Original URL</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Short URL</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {allUrls.map((url) => (
            <tr key={url.short_code}>
              <td style={{ borderBottom: "1px solid #ddd", padding: 8 }}>{url.original_url}</td>
              <td style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                <a href={`${BACKEND_URL}/r/${url.short_code}`} target="_blank" rel="noreferrer">
                  {`${BACKEND_URL}/r/${url.short_code}`}
                </a>
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                <button onClick={() => handleRedirect(url.short_code)}>Go</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
