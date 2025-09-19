// Detect if running inside Docker or local dev
const isDocker = window.location.hostname !== "localhost";

// Use backend service name inside Docker, localhost for dev
const BACKEND_URL = isDocker ? "http://backend:8000" : "http://localhost:8000";

export default BACKEND_URL;
