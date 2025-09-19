const BACKEND_URL = "http://localhost:8000";

export async function shortenUrl(original_url) {
  const response = await fetch(`${BACKEND_URL}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ original_url }),
  });
  return response.json();
}
