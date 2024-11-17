import { API_URL } from "../../../libs";

export const search = async (query: string, signal?: AbortSignal) => {
  console.log("searching for", query);
  const requestBody = { query };

  const response = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    signal,
  });

  console.log(response.json());
  return response.json();
};
