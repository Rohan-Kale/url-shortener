export default function ResultCard({ result }) {
  const copyToClipboard = () => {
    navigator.clipboard?.writeText(result.shortened);
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Short link:</p>
        <a
          href={result.shortened}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 font-medium hover:underline"
        >
          {result.shortened}
        </a>
      </div>
      <button
        onClick={copyToClipboard}
        className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
      >
        Copy
      </button>
    </div>
  );
}