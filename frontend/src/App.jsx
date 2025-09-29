import React, { useState } from "react";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";
import BackgroundCard from "./components/BackgroundCard"; 

export default function App() {
  const [urls, setUrls] = useState([]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-800 to-purple-900 h-32 px-4 pt-10">
      <BackgroundCard>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔗 URL Shortener</h1>

        <UrlForm urls={urls} setUrls={setUrls} />

        {urls.length > 0 && <UrlList urls={urls} />}
      </BackgroundCard>
    </div>
  );
}
