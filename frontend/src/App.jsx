import React, { useState } from "react";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";

export default function App() {
  const [urls, setUrls] = useState([]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start bg-gray-100 px-4 pt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔗 URL Shortener</h1>

      <UrlForm urls={urls} setUrls={setUrls} />

      {urls.length > 0 && <UrlList urls={urls} />}
    </div>
  );
}
