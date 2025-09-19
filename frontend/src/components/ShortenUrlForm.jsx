import React, { useState } from "react";

export default function ShortenUrlForm({ onShorten }) {
  const [originalUrl, setOriginalUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;
    onShorten(originalUrl);
    setOriginalUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md flex gap-2"
      >
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
        >
          Shorten
        </button>
      </form>
    </div>
  );
}
