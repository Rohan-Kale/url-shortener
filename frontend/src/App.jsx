import React, { useState } from "react";
import ShortenUrlForm from "./components/ShortenUrlForm";
import UrlList from "./components/UrlList"; // your existing list component

function App() {
  const [urls, setUrls] = useState([]);

  const handleShorten = (originalUrl) => {
    // call backend /shorten API and update urls
    // example:
    fetch("http://localhost:8000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_url: originalUrl }),
    })
      .then((res) => res.json())
      .then((data) => setUrls((prev) => [data, ...prev]));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ShortenUrlForm onShorten={handleShorten} />
      <UrlList urls={urls} />
    </div>
  );
}

export default App;
