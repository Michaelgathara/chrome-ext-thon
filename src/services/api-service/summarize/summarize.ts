import { API_URL } from "../../../libs";

export const summarize = async (url: string) => {
  const requestBody = { url };

  const response = await fetch(`${API_URL}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return response.json();
};
