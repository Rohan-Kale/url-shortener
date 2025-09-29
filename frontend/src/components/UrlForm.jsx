import React, { useState } from "react";

const BACKEND_URL = "http://localhost:8000";

export default function UrlForm({ urls, setUrls }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to shorten URL");
      }

      const data = await response.json();
      setUrls([{ original_url: url, short_code: data.short_code }, ...urls]);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <input
        type="url"
        placeholder="Enter your URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 bg-transparent"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg p-6 shadow-lg backdrop-blur-sm bg-blue/10 border border-sky-300/20 text-white py-3 hover:bg-indigo-700 transition duration-200 font-medium disabled:opacity-50"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
