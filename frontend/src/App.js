import React from "react";  

function App() {
  const [originalUrl, setOriginalUrl] = React.useState("");
  const [shortUrl, setShortUrl] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/shorten/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });
      const data = await response.json();
      setShortUrl('http://localhost:8000/${data.short_url}');
    } catch (error) {
      console.error("Error shortening url:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button type="submit" style = {{marginLife:"1rem", padding:"0.5rem"}}>Shorten</button>
      </form>

      {shortUrl && (
        <p>
          Shortened URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );

}

export default App;