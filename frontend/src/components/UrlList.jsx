import React from "react";

export default function UrlList({ urls }) {
  return (
    <div className="mt-6 w-full max-w-md space-y-2">
      {urls.map((item, index) => (
        <div
          key={index}
          className="p-3 bg-white rounded-lg shadow-soft flex justify-between items-center"
        >
          {/* Original URL */}
          <p className="text-gray-700 break-all">{item.original_url}</p>

          {/* Clickable short code to redirect in a new tab */}
          <button
            onClick={() =>
              window.open(`http://localhost:8000/r/${item.short_code}`, "_blank")
            }
            className="text-indigo-600 font-semibold hover:underline ml-4"
          >
            {item.short_code}
          </button>
        </div>
      ))}
    </div>
  );
}
