let API_URL: string;

// Check if process and process.env.API_URL are defined
if (typeof process !== "undefined" && process.env.API_URL) {
  API_URL = `${process.env.API_URL}/api`;
} else {
  API_URL =
    "https://gemini-rec-search-api-614660838123.us-central1.run.app/api";
}

export { API_URL };
